"use client";

/**
 * Consent state shared by the banner, the tag loaders and the tracker.
 * Mode is set with NEXT_PUBLIC_CONSENT_MODE:
 *  - "opt-in"  (default) — nothing non-essential runs until the visitor accepts (GDPR/UK-style; safest everywhere)
 *  - "opt-out" — analytics/marketing run by default with a notice + reject option (U.S.-style; GPC always honored)
 */

export type Consent = { analytics: boolean; marketing: boolean; ts?: number; v?: number };

export const CONSENT_KEY = "adbyrd_consent";
export const CONSENT_EVENT = "adbyrd:consent";
export const OPEN_CONSENT_EVENT = "adbyrd:open-consent";
export const CONSENT_MODE: "opt-in" | "opt-out" =
  process.env.NEXT_PUBLIC_CONSENT_MODE === "opt-out" ? "opt-out" : "opt-in";

export function hasGPC() {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function readStoredConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

/** The consent that is actually in force (stored choice, else the mode default; GPC always blocks marketing). */
export function effectiveConsent(): Consent {
  const stored = readStoredConsent();
  const gpc = hasGPC();
  const base = stored ?? (CONSENT_MODE === "opt-out" ? { analytics: true, marketing: true } : { analytics: false, marketing: false });
  return { analytics: base.analytics, marketing: base.marketing && !gpc };
}

export function saveConsent(c: Consent) {
  const value: Consent = { analytics: c.analytics, marketing: c.marketing, ts: Date.now(), v: 1 };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked — choice applies to this page view only */
  }
  applyGoogleConsent();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: effectiveConsent() }));
  window.dataLayer?.push({ event: "consent_update", consent_analytics: value.analytics, consent_marketing: effectiveConsent().marketing });
}

/** Sends a Google Consent Mode v2 update reflecting the effective consent. */
export function applyGoogleConsent() {
  const c = effectiveConsent();
  const g = (v: boolean) => (v ? "granted" : "denied");
  window.gtag?.("consent", "update", {
    analytics_storage: g(c.analytics),
    ad_storage: g(c.marketing),
    ad_user_data: g(c.marketing),
    ad_personalization: g(c.marketing),
  });
}

export function openConsentManager() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[] & { push: (...args: unknown[]) => number };
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void };
    lintrk?: (...args: unknown[]) => void;
    uetq?: unknown[] & { push: (...args: unknown[]) => void };
    clarity?: (...args: unknown[]) => void;
  }
}
