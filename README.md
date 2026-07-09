# Adbyrd — Smart Form Agentics VSL Landing Page

Single-page, mobile-first VSL landing page with one call to action ("Book a free 15-min call"). Built for Next.js App Router + Tailwind CSS, deployable on Vercel as-is.

## Files

| File | Purpose |
| --- | --- |
| `app/page.tsx` | The full landing page (server component, no client JS needed) |
| `app/layout.tsx` | Root layout loading Inter via `next/font` per brand guidelines |

## Setup (3 steps)

1. **Booking link** — In `app/page.tsx`, replace the `BOOKING_URL` constant with your real Calendly / Cal.com link. Every CTA on the page points to it.
2. **Logo** — Drop `logo.png` (the master brand asset) into your project's `/public` folder.
3. **Video embed** — In the hero, replace the placeholder play-button block (marked with a comment) with your Wistia / Vimeo / YouTube iframe:
   ```tsx
   <iframe src="https://..." className="absolute inset-0 h-full w-full" allowFullScreen />
   ```

## Tailwind font mapping

The layout exposes Inter as a CSS variable. Map it to `font-sans`:

**Tailwind v4** (in `globals.css`):
```css
@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}
```

**Tailwind v3** (in `tailwind.config.ts`):
```ts
theme: {
  extend: {
    fontFamily: {
      sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
    },
  },
},
```

## Brand compliance notes

- Colors are hard-coded to the brand guide: Byrd Gradient Orange `#FF6B00 → #E04A00` (sole accent + CTAs), Slate Charcoal `#5C646D` (body), Alpine White canvases, Obsidian Gray `#1A1D20` (dark CTA section). No competing secondary colors.
- Headings use Inter SemiBold, sentence case, −1% tracking; eyebrows/labels are uppercase with +5% tracking — both per the typography architecture.
- The logomark gradient is never flattened; the logo sits in generous clear space in the nav and footer.
- Mobile-first: floating "agent activity" cards appear from `lg:` up; on phones they collapse into an inline stat strip under the video.
