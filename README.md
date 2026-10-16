# Adbyrd — 2027 Website

Lightweight five-page marketing site for Adbyrd, built with **Next.js 16 (App Router)** and **Tailwind CSS 4**. All pages are statically prerendered; no images, databases or API keys required.

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

Requires Node.js 20.9 or newer.

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

- **Contact form** (`components/InquiryForm.tsx`) currently builds a project brief and copies it to the clipboard, as specified in the content doc. To receive inquiries, wire it to a Route Handler or a form service, and add consent/privacy text, spam protection, and an automated acknowledgment.
- **Budget ranges** in `lib/content.ts` (`inquiryOptions.budget`) are placeholders — adjust to your real engagement sizes.
- **Insights** cards are marked "Coming soon" because the articles aren't published yet.
- Add contact email/phone to the footer and contact page once confirmed.
