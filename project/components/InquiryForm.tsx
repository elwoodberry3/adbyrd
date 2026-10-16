"use client";

import { useState, type FormEvent } from "react";
import { Check, ClipboardCopy } from "lucide-react";
import { inquiryOptions } from "@/lib/content";

/**
 * Project inquiry form.
 * Per the content spec, this preview assembles a project brief and copies it
 * to the clipboard — it does NOT submit anything to Adbyrd.
 * For production: add consent/privacy disclosures, spam protection, a secure
 * submission endpoint (e.g. a Next.js Route Handler or form service), and an
 * automated acknowledgment email.
 */
export default function InquiryForm() {
  const [stage, setStage] = useState(inquiryOptions.stage[0]);
  const [brief, setBrief] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = [
      "ADBYRD PROJECT INQUIRY",
      "",
      `Name: ${f.get("name")}`,
      `Company / Organization: ${f.get("company") || "—"}`,
      `Business Email: ${f.get("email")}`,
      `What can we help you with? ${f.get("help")}`,
      `Where are you in the process? ${stage}`,
      `Estimated project budget: ${f.get("budget")}`,
      "",
      "About the project:",
      String(f.get("project")),
    ].join("\n");
    setBrief(text);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const field =
    "mt-2 w-full rounded-xl border border-line bg-cloud px-4 py-3 text-ink outline-none transition focus:border-moss focus:bg-white focus:ring-4 focus:ring-lime/40";
  const label = "text-sm font-semibold text-ink";

  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-xl shadow-forest/5 ring-1 ring-line sm:p-10">
      <p className="text-xs font-semibold tracking-[0.18em] text-moss uppercase">Project Inquiry</p>
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Tell Us What You&apos;re Building.</h2>

      <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Your Name <span className="text-moss">*</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className={label}>
          Company / Organization
          <input name="company" autoComplete="organization" className={field} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Business Email <span className="text-moss">*</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className={label}>
          What Can We Help You With?
          <select name="help" defaultValue={inquiryOptions.help[0]} className={field}>
            {inquiryOptions.help.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Estimated Project Budget
          <select name="budget" defaultValue={inquiryOptions.budget[0]} className={field}>
            {inquiryOptions.budget.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>

        <fieldset className="sm:col-span-2">
          <legend className={label}>Where Are You in the Process?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {inquiryOptions.stage.map((s) => (
              <button
                type="button"
                key={s}
                aria-pressed={stage === s}
                onClick={() => setStage(s)}
                className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                  stage === s ? "bg-forest text-white ring-forest" : "bg-cloud text-slate ring-line hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <label className={`${label} sm:col-span-2`}>
          Tell Us About Your Project <span className="text-moss">*</span>
          <textarea name="project" required rows={5} className={`${field} resize-y`} />
        </label>

        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-forest-2"
          >
            {copied ? <Check className="h-4 w-4 text-lime" /> : <ClipboardCopy className="h-4 w-4 text-lime" />}
            {copied ? "Copied to Clipboard" : "Copy My Project Inquiry"}
          </button>
          <p className="text-xs text-slate sm:max-w-[260px]">
            This interactive preview prepares a project brief; it does not submit information to Adbyrd.
          </p>
        </div>
      </form>

      {brief && (
        <div className="mt-8">
          <p className="text-sm font-semibold">Your project brief</p>
          <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-ink p-4 text-xs leading-relaxed whitespace-pre-wrap text-mint">
            {brief}
          </pre>
        </div>
      )}
    </div>
  );
}
