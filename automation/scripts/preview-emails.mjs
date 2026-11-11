#!/usr/bin/env node
/**
 * Renders both inquiry emails with sample data into automation/emails/preview/
 * (gitignored) so you can review them in a browser at 600px and phone widths.
 *
 *   node automation/scripts/preview-emails.mjs
 *   open automation/emails/preview/index.html
 *
 * Images load from SITE_URL (default https://adbyrd.com). To preview images
 * before deploy, run `npm run dev` in project/ and set SITE_URL=http://localhost:3000.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { AUTOMATION, loadSite } from "./lib/site.mjs";
import { renderInquiryEmails } from "../emails/render.mjs";

export const SAMPLE_PAYLOAD = {
  submissionId: "3f1c9b2e-8d4a-4c1e-9b7f-2a6d5e8c1f40",
  submittedAt: "2026-11-10T15:42:00.000Z",
  source: "adbyrd.com/contact",
  pageUrl: "https://adbyrd.com/contact",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 19_1 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
  name: "Dana O'Neil-Ramirez",
  company: "Rose St. Barbers & Co.",
  email: "dana@example.com",
  help: "AI Phone Receptionist",
  budget: "$3,000 – $5,000",
  stage: "I know the problem, not the solution",
  project:
    "We miss 10–15 calls a day while we're cutting hair.\nMost are people trying to book, and they just call the next shop.\n\nCould an AI receptionist book into Square and text me a summary? <b>Not sure</b> what's realistic & what it costs.",
  marketingOptIn: true,
  attribution: {
    first: {
      source: "google",
      medium: "organic",
      campaign: "gbp_listing",
      landing_page: "/?utm_source=google&utm_medium=organic&utm_campaign=gbp_listing",
      ts: 1762700000000,
    },
    last: {
      source: "facebook",
      medium: "paid_social",
      campaign: "2026_11_missed_calls",
      click_id_type: "fbclid",
      referrer: "https://l.facebook.com/",
      landing_page: "/what-we-do?utm_source=facebook&utm_medium=paid_social&utm_campaign=2026_11_missed_calls",
      ts: 1762780000000,
    },
  },
};

export const SAMPLE_CONFIG = {
  HUBSPOT_PORTAL_ID: "12345678",
  SUPPORT_NOTIFY_TO: "support@adbyrd.com",
  MAIL_FROM_ACK: "Adbyrd <hello@adbyrd.com>",
  MAIL_FROM_NOTIFY: "Adbyrd Website <notifications@adbyrd.com>",
  REPLY_TO_ACK: "support@adbyrd.com",
  SITE_URL: process.env.SITE_URL || "https://adbyrd.com",
  TIMEZONE: "America/Detroit",
};

export async function loadTemplates() {
  const read = (f) => readFile(path.join(AUTOMATION, "emails", f), "utf8");
  const [ackHtml, ackText, notifyHtml, notifyText] = await Promise.all([
    read("inquiry-ack.html"),
    read("inquiry-ack.txt"),
    read("inquiry-notify.html"),
    read("inquiry-notify.txt"),
  ]);
  return { ackHtml, ackText, notifyHtml, notifyText };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const out = path.join(AUTOMATION, "emails", "preview");
  await mkdir(out, { recursive: true });
  const { site } = await loadSite();
  const templates = await loadTemplates();
  const base = { payload: SAMPLE_PAYLOAD, config: SAMPLE_CONFIG, site, templates };
  const ok = renderInquiryEmails({ ...base, crm: { contactOk: true, contactId: "98765", created: true, noteOk: true } });
  const failed = renderInquiryEmails({ ...base, crm: { contactOk: false } });

  const files = {
    "inquiry-ack.html": ok.ack.html,
    "inquiry-ack.txt": ok.ack.text,
    "inquiry-notify.html": ok.notify.html,
    "inquiry-notify.txt": ok.notify.text,
    "inquiry-notify-crm-failed.html": failed.notify.html,
  };
  for (const [name, body] of Object.entries(files)) await writeFile(path.join(out, name), body);

  const frame = (f, w) =>
    `<figure><figcaption>${f} · ${w}px</figcaption><iframe src="${f}" width="${w}" height="1500" loading="lazy"></iframe></figure>`;
  const index = `<!doctype html><meta charset="utf-8"><title>Inquiry email previews</title>
<style>body{font:14px system-ui;margin:24px;background:#f2f2f2}section{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;margin-bottom:40px}
iframe{border:1px solid #ccc;background:#fff}figure{margin:0}figcaption{margin-bottom:6px;color:#555}</style>
<h1>Inquiry email previews</h1>
<p><b>Ack subject:</b> ${ok.ack.subject}<br><b>Notify subject:</b> ${ok.notify.subject}</p>
${["inquiry-ack.html", "inquiry-notify.html", "inquiry-notify-crm-failed.html"]
  .map((f) => `<h2>${f}</h2><section>${frame(f, 600)}${frame(f, 375)}</section>`)
  .join("\n")}`;
  await writeFile(path.join(out, "index.html"), index);
  console.log(`wrote ${Object.keys(files).length + 1} files to ${path.relative(process.cwd(), out)}/`);
}
