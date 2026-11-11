import { clientIp, inquiryLimiter } from "@/lib/rate-limit";
import { fieldErrors, inquirySchema, MIN_ELAPSED_MS, type InquiryFields } from "@/lib/inquiry-schema";

/**
 * POST /api/inquiry
 * The site's only server-side step in the inquiry pipeline:
 * validate → spam checks → rate limit → forward one payload to the n8n webhook.
 * n8n does everything else (HubSpot, both Resend emails, error alerts).
 * See automation/README.md.
 *
 * Responses:
 *   200 { ok: true, submissionId }                  forwarded (or silently dropped as spam)
 *   400 { ok: false, error: "validation", fields }   bad input; `fields` maps field → message
 *   400 { ok: false, error: "verification" }         Turnstile check failed (a person can retry)
 *   429 { ok: false, error: "rate_limited" }
 *   502 { ok: false, error: "upstream" }             n8n unreachable, slow (>8s) or not configured
 *
 * Never logs PII. Only the submissionId and the outcome are logged.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM_TIMEOUT_MS = 8000;
const MAX_BODY_BYTES = 64 * 1024;
const SOURCE = "adbyrd.com/contact";

type Outcome =
  | "forwarded"
  | "invalid"
  | "rate_limited"
  | "spam_honeypot"
  | "spam_too_fast"
  | "turnstile_failed"
  | "turnstile_unreachable"
  | "not_configured"
  | "upstream_error"
  | "upstream_timeout";

function log(outcome: Outcome, submissionId?: string, extra?: Record<string, string | number>) {
  console.info(JSON.stringify({ evt: "inquiry", outcome, submissionId, ...extra }));
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!(await inquiryLimiter.hit(clientIp(req.headers)))) {
    log("rate_limited");
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  // Parse the body, with a size cap
  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) throw new Error("too large");
    raw = JSON.parse(text);
  } catch {
    log("invalid");
    return json({ ok: false, error: "validation", fields: {} }, 400);
  }

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    log("invalid");
    return json({ ok: false, error: "validation", fields: fieldErrors(parsed.error) }, 400);
  }
  const { website, elapsedMs, turnstileToken, ...fields } = parsed.data;
  const { submissionId } = fields;

  // Bot checks: answer like a success so bots learn nothing, and forward nothing.
  if (website) {
    log("spam_honeypot", submissionId);
    return json({ ok: true, submissionId });
  }
  if (elapsedMs < MIN_ELAPSED_MS) {
    log("spam_too_fast", submissionId, { elapsedMs: Math.round(elapsedMs) });
    return json({ ok: true, submissionId });
  }

  // Optional Cloudflare Turnstile. Real people can fail it (expired token, network
  // blip, privacy browser), so a failure is a visible, retryable 400, not a fake success.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const verdict = await verifyTurnstile(turnstileSecret, turnstileToken, clientIp(req.headers));
    if (verdict === "unreachable") {
      log("turnstile_unreachable", submissionId);
      return json({ ok: false, error: "upstream" }, 502);
    }
    if (verdict === "failed") {
      log("turnstile_failed", submissionId);
      return json({ ok: false, error: "verification" }, 400);
    }
  }

  const url = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!url || !secret) {
    log("not_configured", submissionId);
    return json({ ok: false, error: "upstream" }, 502);
  }

  const payload: InquiryFields & {
    submittedAt: string;
    source: string;
    pageUrl: string;
    userAgent: string;
  } = {
    ...fields,
    submittedAt: new Date().toISOString(),
    source: SOURCE,
    pageUrl: (req.headers.get("referer") ?? "").slice(0, 2000),
    userAgent: (req.headers.get("user-agent") ?? "").slice(0, 500),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Adbyrd-Signature": secret },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      log("upstream_error", submissionId, { status: res.status });
      return json({ ok: false, error: "upstream" }, 502);
    }
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    log(timedOut ? "upstream_timeout" : "upstream_error", submissionId);
    return json({ ok: false, error: "upstream" }, 502);
  }

  log("forwarded", submissionId);
  return json({ ok: true, submissionId });
}

async function verifyTurnstile(secret: string, token: string | undefined, ip: string): Promise<"ok" | "failed" | "unreachable"> {
  if (!token) return "failed";
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!res.ok) return "unreachable";
    const data = (await res.json()) as { success?: boolean };
    return data.success ? "ok" : "failed";
  } catch {
    return "unreachable";
  }
}
