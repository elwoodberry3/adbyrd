"use client";

import { tracking } from "@/lib/site-config";
import { effectiveConsent } from "./consent";

type Params = Record<string, string | number | boolean | undefined>;

/**
 * Single entry point for analytics events.
 *  - Always pushes to the dataLayer (GTM triggers on `event`).
 *  - When GA4/Google Ads are loaded directly (no GTM), also sends via gtag.
 *  - Maps key events to ad-platform standard events when marketing consent is granted.
 * Event names follow GA4 recommended naming where one exists.
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));

  window.dataLayer = window.dataLayer || ([] as unknown as NonNullable<Window["dataLayer"]>);
  window.dataLayer.push({ event, ...clean });

  if (!tracking.gtmId && window.gtag && (tracking.ga4Id || tracking.googleAdsId)) {
    window.gtag("event", event, clean);
  }

  if (!effectiveConsent().marketing) return;

  // Ad-platform conversion mapping (only for platforms loaded directly via env IDs)
  const isLead = event === "generate_lead";
  const isContact = event === "phone_click" || event === "email_click" || event === "directions_click";

  if (isLead) {
    window.fbq?.("track", "Lead", { content_name: clean.service as string });
    window.ttq?.track("SubmitForm");
    if (tracking.linkedinLeadConversionId) window.lintrk?.("track", { conversion_id: Number(tracking.linkedinLeadConversionId) });
    if (!tracking.gtmId && tracking.googleAdsId && tracking.googleAdsLeadLabel) {
      window.gtag?.("event", "conversion", { send_to: `${tracking.googleAdsId}/${tracking.googleAdsLeadLabel}` });
    }
    window.uetq?.push("event", "submit_lead_form", {});
  }
  if (isContact) {
    window.fbq?.("track", "Contact");
    window.ttq?.track("Contact");
    window.uetq?.push("event", "contact", { event_label: event });
  }
}
