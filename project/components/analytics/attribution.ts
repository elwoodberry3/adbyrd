"use client";

import { effectiveConsent } from "./consent";

/**
 * First-party marketing attribution.
 * Captures where each visitor came from (UTMs, ad click IDs, referrer, landing page)
 * as both FIRST touch and LAST non-direct touch, so inbound leads carry their source.
 * - Session storage always (no persistence beyond the tab session).
 * - Local storage (cross-visit first-touch) only with analytics consent.
 */

export const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
] as const;
export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "dclid", "fbclid", "msclkid", "ttclid", "li_fat_id", "twclid", "igshid"] as const;

export type Touch = {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  click_id_type?: string;
  click_id?: string;
  referrer?: string;
  landing_page: string;
  ts: number;
};

const FIRST = "adbyrd_first_touch";
const LAST = "adbyrd_last_touch";

const SEARCH = ["google.", "bing.com", "duckduckgo.com", "search.yahoo.", "ecosia.org", "yandex.", "baidu.com", "search.brave.com", "perplexity.ai", "chatgpt.com", "claude.ai", "gemini.google.com", "copilot.microsoft.com"];
const AI_ASSISTANTS = ["perplexity.ai", "chatgpt.com", "claude.ai", "gemini.google.com", "copilot.microsoft.com"];
const SOCIAL = ["facebook.com", "fb.com", "instagram.com", "linkedin.com", "lnkd.in", "t.co", "x.com", "twitter.com", "youtube.com", "tiktok.com", "pinterest.", "reddit.com", "threads.net", "bsky.app"];

const CLICK_SOURCE: Record<string, [string, string]> = {
  gclid: ["google", "cpc"],
  gbraid: ["google", "cpc"],
  wbraid: ["google", "cpc"],
  dclid: ["google", "display"],
  msclkid: ["bing", "cpc"],
  fbclid: ["facebook", "social"],
  igshid: ["instagram", "social"],
  ttclid: ["tiktok", "paid_social"],
  li_fat_id: ["linkedin", "paid_social"],
  twclid: ["x", "paid_social"],
};

function store(key: string, value: Touch, persist: boolean) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    if (persist) localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

function read(key: string): Touch | null {
  try {
    const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Touch) : null;
  } catch {
    return null;
  }
}

/** Classifies the current page load. Returns null for internal navigation. */
export function classifyVisit(): Touch | null {
  const url = new URL(window.location.href);
  const qp = url.searchParams;
  const ref = document.referrer ? new URL(document.referrer) : null;
  const internal = ref && ref.host === url.host;
  const landing = url.pathname + url.search;

  const clickKey = CLICK_ID_KEYS.find((k) => qp.get(k));
  const hasUtm = CAMPAIGN_KEYS.some((k) => qp.get(k));

  if (hasUtm || clickKey) {
    const [cs, cm] = clickKey ? CLICK_SOURCE[clickKey] : ["", ""];
    return {
      source: qp.get("utm_source") || cs || (ref?.hostname ?? "(not set)"),
      medium: qp.get("utm_medium") || cm || "(not set)",
      campaign: qp.get("utm_campaign") || undefined,
      term: qp.get("utm_term") || undefined,
      content: qp.get("utm_content") || undefined,
      click_id_type: clickKey,
      click_id: clickKey ? qp.get(clickKey) || undefined : undefined,
      referrer: ref && !internal ? ref.href : undefined,
      landing_page: landing,
      ts: Date.now(),
    };
  }

  if (internal) return null;

  if (ref) {
    const h = ref.hostname.replace(/^www\./, "");
    const medium = AI_ASSISTANTS.some((d) => h.includes(d))
      ? "ai_assistant"
      : SEARCH.some((d) => h.includes(d))
        ? "organic"
        : SOCIAL.some((d) => h.includes(d))
          ? "social"
          : "referral";
    return { source: h, medium, referrer: ref.href, landing_page: landing, ts: Date.now() };
  }

  return { source: "(direct)", medium: "(none)", landing_page: landing, ts: Date.now() };
}

/** Records first touch (once) and last non-direct touch. Call on initial page load. */
export function captureAttribution() {
  const visit = classifyVisit();
  if (!visit) return { first: read(FIRST), last: read(LAST) };
  const persist = effectiveConsent().analytics;

  const first = read(FIRST);
  if (!first) store(FIRST, visit, persist);
  const isDirect = visit.source === "(direct)";
  if (!isDirect || !read(LAST)) store(LAST, visit, persist);

  return { first: read(FIRST), last: read(LAST) };
}

export function getAttribution() {
  return { first: read(FIRST), last: read(LAST) };
}

export function describeTouch(t: Touch | null) {
  if (!t) return "—";
  return [`${t.source} / ${t.medium}`, t.campaign && `campaign: ${t.campaign}`, t.click_id_type && `(${t.click_id_type})`, `landed on ${t.landing_page}`]
    .filter(Boolean)
    .join(" · ");
}
