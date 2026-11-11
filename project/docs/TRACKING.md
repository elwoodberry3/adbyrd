# Adbyrd — Measurement & Tracking Plan

This site ships with the plumbing for full-funnel measurement. **Nothing loads until you add IDs** in Vercel environment variables (see `.env.example`).

## 1. Architecture

| Layer | What it does | Where |
| --- | --- | --- |
| Consent | Cookie banner + preferences, Google Consent Mode v2, Global Privacy Control honored | `components/analytics/ConsentBanner.tsx`, `consent.ts`, `GoogleTags.tsx` |
| Google | GTM (recommended) **or** direct GA4 + Google Ads | `GoogleTags.tsx` |
| Ad/social pixels | Meta, LinkedIn Insight, TikTok, Microsoft UET (marketing consent only) | `MarketingTags.tsx` |
| Behavior | Microsoft Clarity heatmaps/recordings (analytics consent only) | `MarketingTags.tsx` |
| Cookieless | Vercel Web Analytics + Speed Insights (Core Web Vitals) | `components/analytics/index.tsx` |
| Inbound attribution | First-touch + last non-direct touch: UTMs, click IDs, referrer, landing page | `attribution.ts` |
| Event layer | dataLayer events for every key interaction | `track.ts`, `Tracker.tsx` |
| SEO / entity | JSON-LD (Organization, ProfessionalService, WebSite), sitemap, robots, canonical, OG image, verification tags | `StructuredData.tsx`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `app/layout.tsx` |

**Pick one path per tool.** If GTM is set, configure GA4/Ads inside GTM and leave `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_GOOGLE_ADS_ID` empty. Pixels can be loaded from env IDs (built-in consent gating) *or* GTM — never both.

## 2. Events (dataLayer)

| Event | When | Key parameters | Mark as |
| --- | --- | --- | --- |
| `attribution_ready` | Every full page load | `first_touch_*`, `last_touch_*`, `landing_page` | — |
| `generate_lead` | Inquiry **confirmed by the server** (`/api/inquiry` returned ok). Not fired on validation errors, failures or retries. | `form_name`, `submission_id`, `service`, `project_stage`, `budget_range`, `first_touch_*`, `last_touch_*` | **GA4 key event**, Ads/Meta/LinkedIn/TikTok/UET conversion |
| `form_start` | First focus in inquiry form | `form_name` | Funnel step |
| `phone_click` | Any `tel:` link | `phone_number`, `placement` | **Key event** |
| `email_click` | Any `mailto:` link | `email`, `placement` | **Key event** |
| `directions_click` | Map / directions link | `link_url`, `placement` | Key event (local intent) |
| `social_click` | Social profile icons | `platform`, `placement`, `link_url` | — |
| `outbound_click` | Any other external link | `link_url`, `link_domain`, `link_text` | — |
| `cta_click` | Any `<Button>` or `[data-cta]` | `cta_text`, `cta_href`, `placement` | — |
| `scroll_depth` | 25 / 50 / 75 / 90 % per page | `percent_scrolled`, `page_path` | — |
| `consent_update` | Consent saved | `consent_analytics`, `consent_marketing` | — |

Platform mapping when pixels load from env IDs: `generate_lead` → Meta `Lead`, TikTok `SubmitForm`, LinkedIn conversion, Google Ads conversion, UET `submit_lead_form`; contact clicks → Meta/TikTok `Contact`.

In GA4, register custom dimensions for `service`, `budget_range`, `project_stage`, `placement`, `platform`, `first_touch_source`, `first_touch_medium`, `first_touch_campaign`, `submission_id`.

**Join key:** `submission_id` is a random UUID created per form fill. The same value is the HubSpot contact's `adbyrd_last_submission_id`, the title of its inquiry Note, and part of both Resend idempotency keys. Use it to match a conversion to a lead. No personal data (name, email, message) is ever sent to analytics.

## 3. UTM conventions

Lowercase, underscores, no spaces.

| Channel | utm_source | utm_medium | utm_campaign example |
| --- | --- | --- | --- |
| Google Business Profile website link | `google` | `organic` | `gbp_listing` |
| GBP posts / offers | `google` | `organic` | `gbp_post_<topic>` |
| LinkedIn organic post | `linkedin` | `social` | `<yyyy_mm>_<topic>` |
| LinkedIn ads | `linkedin` | `paid_social` | `<campaign>` |
| Meta ads | `facebook` / `instagram` | `paid_social` | `<campaign>` |
| TikTok ads | `tiktok` | `paid_social` | `<campaign>` |
| YouTube description | `youtube` | `social` | `<video_slug>` |
| Email | `newsletter` / `outreach` | `email` | `<send_name>` |
| Events / QR codes | `event_<name>` | `offline` | `<event>_<yyyy>` |

**Important:** set the GBP "Website" field to `https://adbyrd.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_listing` so Maps/Local traffic is separated from regular organic search.

Outbound social links on this site already carry `utm_source=adbyrd.com&utm_medium=website&utm_campaign=social_profiles&utm_content=<placement>_<platform>`.

## 4. Launch checklist

- [ ] Create GA4 property + GTM container; add IDs to Vercel.
- [ ] In GTM: GA4 Config tag, Conversion Linker, Google Ads conversion on `generate_lead`, triggers for the events above; enable Consent Mode checks.
- [ ] GA4: mark key events; set data retention to 14 months; link Google Ads and Search Console; enable Google Signals only if consent covers it.
- [ ] Verify Search Console + Bing Webmaster Tools (tokens in env); submit `/sitemap.xml`.
- [ ] Google Business Profile: NAP exactly `Adbyrd · 251 N Rose St, Kalamazoo, MI 49007 · +1 (888) 712-1694`; UTM'd website link; add `NEXT_PUBLIC_GBP_PROFILE_URL` and `NEXT_PUBLIC_GBP_REVIEW_URL`; replace geo coordinates in `lib/site-config.ts` with the GBP pin; add hours to JSON-LD.
- [ ] Meta: verify domain, add Pixel ID; plan **Conversions API** (server-side). It can be added as an n8n step later, keyed on `submission_id`.
- [ ] LinkedIn Insight Tag + lead conversion; TikTok Pixel; Microsoft UET; Clarity.
- [ ] Enable Vercel Web Analytics and Speed Insights in the Vercel dashboard.
- [x] Inquiry form posts to `/api/inquiry` → n8n → HubSpot, with `getAttribution()` first/last touch on every lead (see `../automation/README.md`).
- [ ] Finish the pipeline's manual setup and run its end-to-end checklist (`../automation/README.md`).
- [ ] Run a cookie scan, complete the Cookie Policy table, and have counsel finalize all `/legal` pages.
- [ ] Add a Content-Security-Policy (Report-Only first) allowing only enabled tag domains.
- [ ] Test with GTM Preview, GA4 DebugView, Meta Events Manager test events, and Tag Assistant (consent states).
