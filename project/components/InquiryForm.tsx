"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, CircleAlert, CircleCheck, ClipboardCopy, LoaderCircle, Mail, Phone, RotateCw } from "lucide-react";
import { inquiryOptions } from "@/lib/content";
import { fieldErrors, inquirySchema, type FieldErrors, type InquiryInput, type InquiryStage } from "@/lib/inquiry-schema";
import { contact } from "@/lib/site-config";
import { describeTouch, getAttribution } from "./analytics/attribution";
import { track } from "./analytics/track";
import Turnstile, { TURNSTILE_SITE_KEY } from "./Turnstile";

/**
 * Project inquiry form.
 * Validates with the shared zod schema (lib/inquiry-schema.ts), then POSTs JSON
 * to /api/inquiry, which runs the spam checks and forwards the inquiry to n8n.
 * n8n creates or updates the HubSpot contact and sends both emails
 * (see automation/README.md).
 *  - submissionId is created once per form fill and reused on retry, so a retry
 *    after a slow first attempt can't send duplicate emails.
 *  - generate_lead fires only after the server confirms, with submission_id as
 *    the join key and no personal data.
 *  - If sending fails, the error panel offers retry, email, phone and a
 *    copy-my-brief fallback, so the lead is never lost.
 */

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; firstName: string }
  | { kind: "verification" }
  | { kind: "error"; reason: "rate_limited" | "upstream" | "network" };

type Field = keyof InquiryInput;

function newSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Fallback for non-secure contexts (e.g. testing over a LAN IP): RFC 4122 v4 from getRandomValues
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function buildBrief(p: InquiryInput) {
  const { first, last } = p.attribution ?? {};
  return [
    "ADBYRD PROJECT INQUIRY",
    "",
    `Name: ${p.name}`,
    `Business Name: ${p.company || "—"}`,
    `Business Email: ${p.email}`,
    `What can we help you with? ${p.help}`,
    `Where are you in the process? ${p.stage}`,
    `Estimated project budget: ${p.budget}`,
    "",
    "About the project:",
    p.project,
    "",
    `First touch: ${describeTouch(first ?? null)}`,
    `Latest touch: ${describeTouch(last ?? null)}`,
    `Reference: ${p.submissionId}`,
  ].join("\n");
}

export default function InquiryForm() {
  const [stage, setStage] = useState<InquiryStage>(inquiryOptions.stage[0]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [copied, setCopied] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const started = useRef(false);
  const mountedAt = useRef(0);
  const startedAt = useRef<number | null>(null);
  const submissionId = useRef("");
  const lastPayload = useRef<InquiryInput | null>(null);
  const turnstileToken = useRef<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
    submissionId.current = newSubmissionId();
  }, []);

  // Move focus to the success or error panel when it appears
  useEffect(() => {
    if (status.kind === "success" || status.kind === "error") panelRef.current?.focus();
  }, [status.kind]);

  function readForm(form: HTMLFormElement): InquiryInput {
    const f = new FormData(form);
    const since = startedAt.current ?? mountedAt.current;
    return {
      submissionId: submissionId.current,
      name: String(f.get("name") ?? ""),
      company: String(f.get("company") ?? ""),
      email: String(f.get("email") ?? ""),
      help: String(f.get("help") ?? "") as InquiryInput["help"],
      budget: String(f.get("budget") ?? "") as InquiryInput["budget"],
      stage,
      project: String(f.get("project") ?? ""),
      marketingOptIn: f.get("marketingOptIn") === "on",
      attribution: getAttribution(),
      website: String(f.get("website") ?? ""),
      elapsedMs: since ? Date.now() - since : 0,
      turnstileToken: turnstileToken.current ?? undefined,
    };
  }

  function showErrors(next: FieldErrors) {
    setErrors(next);
    const first = (Object.keys(next) as Field[])[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function send(payload: InquiryInput) {
    lastPayload.current = payload;
    setStatus({ kind: "submitting" });
    setCopied(false);

    let res: Response;
    try {
      res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setStatus({ kind: "error", reason: "network" });
      return;
    }
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      submissionId?: string;
      error?: string;
      fields?: FieldErrors;
    };

    if (res.ok && body.ok) {
      const parsed = inquirySchema.parse(payload);
      const { first, last } = parsed.attribution;
      // Lead conversion, only after the server confirms. No personal data is sent.
      track("generate_lead", {
        form_name: "project_inquiry",
        submission_id: body.submissionId ?? payload.submissionId,
        service: parsed.help,
        project_stage: parsed.stage,
        budget_range: parsed.budget,
        first_touch_source: first?.source,
        first_touch_medium: first?.medium,
        first_touch_campaign: first?.campaign,
        last_touch_source: last?.source,
        last_touch_medium: last?.medium,
        last_touch_campaign: last?.campaign,
      });
      submissionId.current = newSubmissionId();
      setStatus({ kind: "success", firstName: parsed.name.split(/\s+/)[0] });
      return;
    }

    if (res.status === 400 && body.error === "verification") {
      setTurnstileKey((k) => k + 1);
      setStatus({ kind: "verification" });
      return;
    }
    if (res.status === 400 && body.error === "validation") {
      setStatus({ kind: "idle" });
      showErrors(body.fields ?? {});
      return;
    }
    setStatus({ kind: "error", reason: res.status === 429 ? "rate_limited" : "upstream" });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const payload = readForm(e.currentTarget);
    const check = inquirySchema.safeParse(payload);
    if (!check.success) {
      showErrors(fieldErrors(check.error));
      return;
    }
    setErrors({});
    void send(payload);
  }

  function retry() {
    if (!lastPayload.current) return;
    void send({ ...lastPayload.current, turnstileToken: turnstileToken.current ?? undefined });
  }

  async function copyBrief() {
    if (!lastPayload.current) return;
    try {
      await navigator.clipboard.writeText(buildBrief(lastPayload.current));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const busy = status.kind === "submitting";
  const field =
    "mt-2 w-full rounded-xl border border-line bg-ivory px-4 py-3 text-ink outline-none transition focus:border-steel focus:bg-white focus:ring-4 focus:ring-ember/30 aria-[invalid=true]:border-ember-2 aria-[invalid=true]:bg-white";
  const label = "text-sm font-semibold text-ink";
  const a11y = (name: Field) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `err-${name}` } : {};
  const clearError = (name: string) =>
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name as Field];
      return next;
    });

  const liveMessage =
    status.kind === "submitting"
      ? "Sending your inquiry…"
      : status.kind === "success"
        ? "Your inquiry was sent."
        : status.kind === "verification"
          ? "Please complete the verification and try again."
          : status.kind === "error"
            ? "Your inquiry could not be sent."
            : Object.keys(errors).length
              ? "Please fix the highlighted fields."
              : "";

  return (
    <div
      className={`rounded-lg bg-white p-6 shadow-xl shadow-night/5 ring-1 ring-line sm:p-10 ${status.kind === "success" ? "self-start" : ""}`}
    >
      <p role="status" aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      {status.kind === "success" ? (
        <div ref={panelRef} tabIndex={-1} className="outline-none" data-state="success">
          <span className="grid h-12 w-12 place-items-center rounded-pill bg-night text-mist">
            <CircleCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-steel uppercase">Inquiry Received</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Thanks, {status.firstName}. Your inquiry is in.
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-slate">
            Check your inbox for a confirmation; we reply within one business day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6 text-sm">
            <a href={`tel:${contact.phoneE164}`} className="inline-flex items-center gap-2 font-semibold text-night hover:text-steel">
              <Phone className="h-4 w-4 text-steel" aria-hidden="true" /> {contact.phoneDisplay}
            </a>
            <span className="text-line" aria-hidden="true">
              ·
            </span>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 font-semibold text-night hover:text-steel">
              <Mail className="h-4 w-4 text-steel" aria-hidden="true" /> {contact.email}
            </a>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold tracking-[0.18em] text-steel uppercase">Project Inquiry</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Tell Us About Your Business.</h2>

          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            onChange={(e) => clearError((e.target as unknown as HTMLInputElement).name)}
            onFocusCapture={() => {
              if (!started.current) {
                started.current = true;
                startedAt.current = Date.now();
                track("form_start", { form_name: "project_inquiry" });
              }
            }}
            className="mt-8 grid gap-5 sm:grid-cols-2"
          >
            <div>
              <label className={label}>
                Your Name <span className="text-steel">*</span>
                <input name="name" required maxLength={120} autoComplete="name" className={field} {...a11y("name")} />
              </label>
              <FieldError name="name" message={errors.name} />
            </div>
            <div>
              <label className={label}>
                Business Name
                <input name="company" maxLength={160} autoComplete="organization" className={field} {...a11y("company")} />
              </label>
              <FieldError name="company" message={errors.company} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>
                Business Email <span className="text-steel">*</span>
                <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} {...a11y("email")} />
              </label>
              <FieldError name="email" message={errors.email} />
            </div>
            <div>
              <label className={label}>
                What Can We Help You With?
                <select name="help" defaultValue={inquiryOptions.help[0]} className={field} {...a11y("help")}>
                  {inquiryOptions.help.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <FieldError name="help" message={errors.help} />
            </div>
            <div>
              <label className={label}>
                Estimated Project Budget
                <select name="budget" defaultValue={inquiryOptions.budget[0]} className={field} {...a11y("budget")}>
                  {inquiryOptions.budget.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <FieldError name="budget" message={errors.budget} />
            </div>

            <fieldset className="sm:col-span-2" {...(errors.stage ? { "aria-describedby": "err-stage" } : {})}>
              <legend className={label}>Where Are You in the Process?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {inquiryOptions.stage.map((s) => (
                  <button
                    type="button"
                    key={s}
                    aria-pressed={stage === s}
                    onClick={() => {
                      setStage(s);
                      clearError("stage");
                    }}
                    className={`rounded-pill px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                      stage === s ? "bg-night text-white ring-night" : "bg-ivory text-slate ring-line hover:text-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <FieldError name="stage" message={errors.stage} />
            </fieldset>

            <div className="sm:col-span-2">
              <label className={label}>
                What&apos;s Going On? Missed calls, booking headaches, an app idea… <span className="text-steel">*</span>
                <textarea
                  name="project"
                  required
                  rows={5}
                  maxLength={5000}
                  className={`${field} resize-y`}
                  {...a11y("project")}
                />
              </label>
              <FieldError name="project" message={errors.project} />
            </div>

            <label className="flex items-start gap-3 text-sm text-slate sm:col-span-2">
              <input
                type="checkbox"
                name="marketingOptIn"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-night"
              />
              Send me occasional tips and updates from Adbyrd.
            </label>

            {/* Honeypot: hidden from people and assistive tech; bots that fill every field reveal themselves */}
            <div className="sr-only" aria-hidden="true">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>

            {TURNSTILE_SITE_KEY && (
              <div className="sm:col-span-2">
                <Turnstile resetKey={turnstileKey} onToken={(t) => (turnstileToken.current = t)} />
                {status.kind === "verification" && (
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-ink">
                    <CircleAlert className="h-4 w-4 shrink-0 text-ember-2" aria-hidden="true" />
                    Please complete the verification and try again.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={busy}
                aria-disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-night px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-night-2 disabled:cursor-wait disabled:opacity-80"
              >
                {busy && <LoaderCircle className="h-4 w-4 animate-spin text-mist" aria-hidden="true" />}
                {busy ? "Sending…" : "Send My Project Inquiry"}
              </button>
              <p className="text-xs text-slate sm:max-w-[260px]">
                By sending, you agree we may contact you about your inquiry. See our{" "}
                <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-night">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>

          {status.kind === "error" && (
            <div
              ref={panelRef}
              tabIndex={-1}
              data-state="error"
              className="mt-8 rounded-lg bg-ivory p-6 ring-1 ring-line outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              <p className="flex items-center gap-2 font-semibold text-ink">
                <CircleAlert className="h-5 w-5 shrink-0 text-ember-2" aria-hidden="true" />
                {status.reason === "rate_limited"
                  ? "That's a lot of sends in a short time."
                  : "We couldn't send your inquiry just now."}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {status.reason === "rate_limited"
                  ? "Please wait a few minutes and try again, or reach us directly."
                  : "Nothing you typed is lost. Try again, or reach us directly."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-2 rounded-pill bg-night px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-night-2"
                >
                  <RotateCw className="h-4 w-4 text-mist" aria-hidden="true" /> Try Again
                </button>
                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent("Project inquiry")}`}
                  className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2.5 text-sm font-semibold text-night ring-1 ring-line hover:ring-steel"
                >
                  <Mail className="h-4 w-4 text-steel" aria-hidden="true" /> {contact.email}
                </a>
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2.5 text-sm font-semibold text-night ring-1 ring-line hover:ring-steel"
                >
                  <Phone className="h-4 w-4 text-steel" aria-hidden="true" /> {contact.phoneDisplay}
                </a>
              </div>
              <button
                type="button"
                onClick={copyBrief}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate underline-offset-4 hover:text-night hover:underline"
              >
                {copied ? <Check className="h-4 w-4 text-steel" aria-hidden="true" /> : <ClipboardCopy className="h-4 w-4 text-steel" aria-hidden="true" />}
                {copied ? "Brief copied. Paste it into an email to us." : "Copy my brief to send it yourself"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FieldError({ name, message }: { name: Field; message?: string }) {
  if (!message) return null;
  return (
    <p id={`err-${name}`} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-ink">
      <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0 text-ember-2" aria-hidden="true" />
      {message}
    </p>
  );
}
