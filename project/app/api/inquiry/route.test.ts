import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { inquiryOptions } from "@/lib/content";
import { inquiryLimiter } from "@/lib/rate-limit";
import { POST } from "./route";

const ID = "3f1c9b2e-8d4a-4c1e-9b7f-2a6d5e8c1f40";
const WEBHOOK = "https://n8n.example.test/webhook/adbyrd-inquiry";

const body = (over: Record<string, unknown> = {}) => ({
  submissionId: ID,
  name: "Dana O'Neil",
  company: "",
  email: "dana@example.com",
  help: inquiryOptions.help[0],
  budget: inquiryOptions.budget[1],
  stage: inquiryOptions.stage[0],
  project: "We miss a lot of calls while we work.",
  marketingOptIn: true,
  attribution: { first: { source: "google", medium: "organic", landing_page: "/", ts: 1 }, last: null },
  website: "",
  elapsedMs: 15_000,
  ...over,
});

function req(payload: unknown, headers: Record<string, string> = {}) {
  return new Request("https://adbyrd.com/api/inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      referer: "https://adbyrd.com/contact",
      "user-agent": "vitest",
      ...headers,
    },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  inquiryLimiter.reset();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("N8N_WEBHOOK_URL", WEBHOOK);
  vi.stubEnv("N8N_WEBHOOK_SECRET", "test-secret");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/inquiry", () => {
  it("forwards a valid inquiry to n8n with the secret header and the client's submissionId", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 202 }));
    const res = await POST(req(body()));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, submissionId: ID });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(WEBHOOK);
    expect((init?.headers as Record<string, string>)["X-Adbyrd-Signature"]).toBe("test-secret");
    expect(init?.signal).toBeInstanceOf(AbortSignal);

    const sent = JSON.parse(String(init?.body));
    expect(sent).toMatchObject({
      submissionId: ID,
      source: "adbyrd.com/contact",
      pageUrl: "https://adbyrd.com/contact",
      userAgent: "vitest",
      name: "Dana O'Neil",
      email: "dana@example.com",
      marketingOptIn: true,
    });
    expect(Date.parse(sent.submittedAt)).not.toBeNaN();
    // Spam signals never leave the site
    expect(sent).not.toHaveProperty("website");
    expect(sent).not.toHaveProperty("elapsedMs");
    expect(sent).not.toHaveProperty("turnstileToken");
  });

  it("never logs personal data", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 202 }));
    await POST(req(body()));
    const logged = vi.mocked(console.info).mock.calls.flat().join(" ");
    expect(logged).toContain(ID);
    expect(logged).not.toContain("dana@example.com");
    expect(logged).not.toContain("O'Neil");
  });

  it("fakes success for a filled honeypot and forwards nothing", async () => {
    const res = await POST(req(body({ website: "http://spam.example" })));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fakes success for a too-fast submission and forwards nothing", async () => {
    const res = await POST(req(body({ elapsedMs: 900 })));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 with per-field errors", async () => {
    const res = await POST(req(body({ email: "nope", project: "short", help: "Other" })));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toMatchObject({ ok: false, error: "validation" });
    expect(Object.keys(json.fields).sort()).toEqual(["email", "help", "project"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a submissionId that isn't a UUID", async () => {
    const res = await POST(req(body({ submissionId: "not-a-uuid" })));
    expect(res.status).toBe(400);
    expect((await res.json()).fields).toHaveProperty("submissionId");
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await POST(req("{nope"));
    expect(res.status).toBe(400);
  });

  it("returns 502 when n8n answers with an error", async () => {
    fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
    const res = await POST(req(body()));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "upstream" });
  });

  it("returns 502 when n8n times out", async () => {
    fetchMock.mockRejectedValue(new DOMException("The operation timed out.", "TimeoutError"));
    const res = await POST(req(body()));
    expect(res.status).toBe(502);
  });

  it("returns 502 when the webhook isn't configured", async () => {
    vi.stubEnv("N8N_WEBHOOK_URL", "");
    const res = await POST(req(body()));
    expect(res.status).toBe(502);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rate-limits by the first x-forwarded-for entry", async () => {
    fetchMock.mockImplementation(async () => new Response(null, { status: 202 }));
    for (let i = 0; i < 5; i++) {
      // A different (forgeable) tail each time must not reset the limit
      const res = await POST(req(body(), { "x-forwarded-for": `198.51.100.1, 10.0.0.${i}` }));
      expect(res.status).toBe(200);
    }
    const blocked = await POST(req(body(), { "x-forwarded-for": "198.51.100.1, 10.0.0.99" }));
    expect(blocked.status).toBe(429);
    const other = await POST(req(body(), { "x-forwarded-for": "198.51.100.2" }));
    expect(other.status).toBe(200);
  });

  describe("with Turnstile enabled", () => {
    beforeEach(() => vi.stubEnv("TURNSTILE_SECRET_KEY", "ts-secret"));

    it("returns a visible 400 verification error when the token fails", async () => {
      fetchMock.mockResolvedValueOnce(Response.json({ success: false }));
      const res = await POST(req(body({ turnstileToken: "bad" })));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: "verification" });
      expect(fetchMock).toHaveBeenCalledTimes(1); // siteverify only, nothing to n8n
    });

    it("returns 400 verification when the token is missing", async () => {
      const res = await POST(req(body()));
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe("verification");
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("forwards when the token verifies", async () => {
      fetchMock
        .mockResolvedValueOnce(Response.json({ success: true }))
        .mockResolvedValueOnce(new Response(null, { status: 202 }));
      const res = await POST(req(body({ turnstileToken: "good" })));
      expect(res.status).toBe(200);
      expect(fetchMock.mock.calls[0][0]).toContain("challenges.cloudflare.com");
      expect(fetchMock.mock.calls[1][0]).toBe(WEBHOOK);
    });
  });
});
