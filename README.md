# Adbyrd — 2027 Website

Lightweight five-page marketing site for Adbyrd, built with **Next.js 16 (App Router)** and **Tailwind CSS 4**. All pages are statically prerendered. The only server code is `/api/inquiry`, which forwards the contact form to n8n (see [`automation/README.md`](automation/README.md)).

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Adbyrd |
| `/what-we-do` | What Adbyrd Can Do for You |
| `/process` | Our Development Process |
| `/contact` | Contact Adbyrd |

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

Requires Node.js 22.18 or newer (the automation scripts load `lib/*.ts` directly).

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repo.
3. Vercel detects Next.js automatically — keep the default settings and click **Deploy**.
4. Add your domain (e.g. adbyrd.com) under **Project → Settings → Domains**.

Or from the command line: `npx vercel` (preview) then `npx vercel --prod`.

## Editing content

All copy lives in `lib/content.ts` (capabilities, industries, services, engagement models, process stages, etc.). Page-specific headlines and paragraphs are in `app/**/page.tsx`.

Brand colors and fonts are defined in the `@theme` block of `app/globals.css`.

## Before launch

- **Inquiry pipeline:** the contact form now posts to `/api/inquiry`, which hands off to n8n → HubSpot + Resend. Before launch, finish the manual setup in [`automation/README.md`](automation/README.md): verify adbyrd.com in Resend, create the HubSpot private app and run the properties script, set up the n8n credentials and Config node, and set `N8N_WEBHOOK_URL` / `N8N_WEBHOOK_SECRET` in Vercel.
- **Budget ranges** in `lib/content.ts` (`inquiryOptions.budget`) are placeholders — adjust to your real engagement sizes.
- **Insights** cards are marked "Coming soon" because the articles aren't published yet.
- Add contact email/phone to the footer and contact page once confirmed.
