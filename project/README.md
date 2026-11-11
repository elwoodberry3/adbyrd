# Adbyrd — 2027 Website

Marketing site for Adbyrd, built with **Next.js 16 (App Router)** and **Tailwind CSS 4**. Every page is prerendered as static HTML. The one dynamic route is `/api/inquiry`, which validates the contact form and forwards it to n8n. Tracking tags stay off until their environment variables are set.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home (Sentinel hero) |
| `/about` | About Adbyrd |
| `/what-we-do` | Services & engagement models |
| `/process` | Development process |
| `/contact` | Contact + project inquiry |
| `/legal` | Trust & Legal Center |
| `/legal/privacy` · `/terms` · `/cookies` · `/privacy-choices` · `/accessibility` · `/security` · `/responsible-ai` | Policy placeholders (need legal review) |

Also generated: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`, and `/.well-known/security.txt`.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — add tracking IDs
npm run dev                  # http://localhost:3000
npm run build
npm run typecheck            # also `npm run lint` (an alias; ESLint isn't set up yet)
npm test                     # Vitest: schema, /api/inquiry, email rendering, n8n workflow
```

Requires Node.js 22.18 or newer.

To try the form end to end locally, run `npm run mock:n8n` in a second terminal and set `N8N_WEBHOOK_URL=http://localhost:5678/webhook/adbyrd-inquiry` and `N8N_WEBHOOK_SECRET=dev-secret` in `.env.local`. Email previews: `npm run emails:preview`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repo. Keep the default settings.
3. Under **Settings → Environment Variables**, add the IDs you have from `.env.example`.
4. Turn on **Web Analytics** and **Speed Insights** in the Vercel project.
5. Add `adbyrd.com` under **Settings → Domains**.

## Where things live

- **Copy:** `lib/content.ts` holds the site copy. Headlines are in `app/**/page.tsx`.
- **Contact info, socials, tracking IDs:** `lib/site-config.ts`.
- **Legal placeholders:** `lib/legal.ts`.
- **Brand:** the palette and radii (pills 7px, cards 0.5rem) are in the `@theme` block of `app/globals.css`. Logos are in `public/brand/`.
- **Sentinel hero:** `components/AICore.tsx`. It's an SVG and CSS animation.
- **Measurement:** `components/analytics/*`. See **docs/TRACKING.md** for the event list, UTM conventions and launch checklist.
- **Inquiry pipeline:** `components/InquiryForm.tsx` → `app/api/inquiry/route.ts` (validation in `lib/inquiry-schema.ts`) → n8n. The workflow, email templates and HubSpot setup live in `../automation/`. See **../automation/README.md**.
- **Email images:** `public/email/` (served at `/email/*` for the transactional emails).

## Before launch

- Have counsel complete and approve every `/legal` page. Replace all `[BRACKETED]` items.
- Finish the inquiry pipeline setup in `../automation/README.md` (Resend domain, HubSpot private app + properties script, n8n credentials + Config node, Vercel env vars), then run its end-to-end checklist. The form already sends `getAttribution()` with every inquiry.
- Decide whether to turn on Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`). If you do, add `challenges.cloudflare.com` to the CSP.
- Set the geo pin and opening hours in `lib/site-config.ts` / `components/StructuredData.tsx` to match the Google Business Profile.
- Replace the placeholder budget ranges in `lib/content.ts`.
- Add a Content-Security-Policy in `next.config.mjs` once the tag list is final.
