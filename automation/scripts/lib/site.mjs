/**
 * Loads site content straight from the Next.js app's TypeScript sources
 * (Node >= 22.18 strips types natively), so emails, the n8n workflow and the
 * HubSpot properties always match what the site shows.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const PROJECT = path.join(ROOT, "project");
export const AUTOMATION = path.join(ROOT, "automation");

// project/package.json has no "type" field, so Node prints a one-line notice when it
// loads the .ts files as ESM. It's harmless; keep script output clean.
const emit = process.emitWarning;
process.emitWarning = function (warning, ...rest) {
  const code = typeof rest[0] === "object" ? rest[0]?.code : rest[1];
  if (code === "MODULE_TYPELESS_PACKAGE_JSON") return;
  return emit.call(process, warning, ...rest);
};

const lib = (f) => import(path.join(PROJECT, "lib", f));

/** UTM campaign for links inside the acknowledgment email. */
export const ACK_CAMPAIGN = "inquiry_ack";

/** Legal links shown in the acknowledgment footer (slugs from lib/legal.ts). */
const FOOTER_LEGAL = ["privacy", "terms", "privacy-choices"];

export async function loadSite() {
  const [{ nextSteps, inquiryOptions }, cfg, { legalDocs }] = await Promise.all([
    lib("content.ts"),
    lib("site-config.ts"),
    lib("legal.ts"),
  ]);
  return {
    inquiryOptions: {
      help: [...inquiryOptions.help],
      stage: [...inquiryOptions.stage],
      budget: [...inquiryOptions.budget],
    },
    site: {
      contact: {
        phoneDisplay: cfg.contact.phoneDisplay,
        phoneE164: cfg.contact.phoneE164,
        email: cfg.contact.email,
        addressOneLine: cfg.addressOneLine,
      },
      nextSteps: nextSteps.map(({ title, body }) => ({ title, body })),
      socials: cfg.socials.map((s) => ({
        platform: s.platform,
        label: s.label,
        url: cfg.withUtm(s.url, { medium: "email", campaign: ACK_CAMPAIGN, content: s.platform }),
      })),
      legal: FOOTER_LEGAL.map((slug) => {
        const doc = legalDocs.find((d) => d.slug === slug);
        if (!doc) throw new Error(`lib/legal.ts has no "${slug}" page`);
        return { label: doc.short, path: `/legal/${slug}` };
      }),
    },
  };
}
