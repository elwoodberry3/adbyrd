"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { CONSENT_MODE, OPEN_CONSENT_EVENT, effectiveConsent, hasGPC, readStoredConsent, saveConsent } from "./consent";

/**
 * Cookie / consent banner with a preferences panel.
 * Wires into Google Consent Mode v2 and gates all non-Google pixels.
 * Re-open anytime via the footer "Cookie Settings" button.
 */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [gpc, setGpc] = useState(false);

  useEffect(() => {
    setGpc(hasGPC());
    const c = effectiveConsent();
    setAnalytics(c.analytics);
    setMarketing(c.marketing);
    if (!readStoredConsent()) setOpen(true);
    const reopen = () => {
      const now = effectiveConsent();
      setAnalytics(now.analytics);
      setMarketing(now.marketing);
      setCustom(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open) return null;

  const decide = (c: { analytics: boolean; marketing: boolean }) => {
    saveConsent(c);
    setOpen(false);
    setCustom(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[420px]"
    >
      <div className="rounded-lg bg-night p-6 text-white shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-pill bg-white/10 text-mist">
              <Cookie className="h-5 w-5" />
            </span>
            <h2 id="consent-title" className="text-base font-semibold">
              Your privacy, your choice
            </h2>
          </div>
          {CONSENT_MODE === "opt-out" && (
            <button
              type="button"
              aria-label="Close"
              onClick={() => decide(effectiveConsent())}
              className="grid h-8 w-8 place-items-center rounded-pill text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/70">
          We use cookies and similar technologies to run this site, measure performance, and improve our marketing. Choose
          what you&apos;re comfortable with. See our{" "}
          <Link href="/legal/cookies" className="underline decoration-mist/60 underline-offset-2 hover:text-white">
            Cookie Policy
          </Link>
          .
        </p>
        {gpc && (
          <p className="mt-2 text-xs text-mist">
            Global Privacy Control detected — marketing &amp; advertising cookies stay off.
          </p>
        )}

        {custom && (
          <div className="mt-4 space-y-2">
            <Toggle label="Strictly necessary" desc="Security and remembering your choices." checked disabled />
            <Toggle label="Analytics" desc="Google Analytics, Microsoft Clarity." checked={analytics} onChange={setAnalytics} />
            <Toggle
              label="Marketing"
              desc="Google Ads, Meta, LinkedIn, TikTok, Microsoft Ads."
              checked={marketing && !gpc}
              disabled={gpc}
              onChange={setMarketing}
            />
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {custom ? (
            <button
              type="button"
              onClick={() => decide({ analytics, marketing })}
              className="flex-1 rounded-pill bg-ember px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ember-2"
            >
              Save preferences
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => decide({ analytics: true, marketing: true })}
                className="flex-1 rounded-pill bg-ember px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ember-2"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => decide({ analytics: false, marketing: false })}
                className="flex-1 rounded-pill bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={() => setCustom(true)}
                className="w-full rounded-pill px-4 py-2 text-sm font-medium text-white/70 hover:text-white"
              >
                Customize
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  disabled = false,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-center justify-between gap-4 rounded-lg bg-white/5 px-4 py-3 ${disabled ? "opacity-70" : "cursor-pointer"}`}>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-white/55">{desc}</span>
      </span>
      <input
        type="checkbox"
        className="h-5 w-5 shrink-0 accent-[#e07a3f]"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}
