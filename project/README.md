# Adbyrd — 2027 Website

Marketing site for Adbyrd, built with **Next.js 16 (App Router)** and **Tailwind CSS 4**. Every page is prerendered as static HTML. Tracking tags stay off until their environment variables are set.

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
```

Requires Node.js 20.9 or newer.

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

## Before launch

- Have counsel complete and approve every `/legal` page. Replace all `[BRACKETED]` items.
- Wire the inquiry form (`components/InquiryForm.tsx`) to a CRM or backend. Right now it copies a brief to the clipboard and fires `generate_lead`. Pass `getAttribution()` along so each lead keeps its source.
- Set the geo pin and opening hours in `lib/site-config.ts` / `components/StructuredData.tsx` to match the Google Business Profile.
- Replace the placeholder budget ranges in `lib/content.ts`.
- Add a Content-Security-Policy in `next.config.mjs` once the tag list is final.
