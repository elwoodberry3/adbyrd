import { z } from "zod";
import { inquiryOptions } from "@/lib/content";

/**
 * Shared validation for the project inquiry.
 * Imported by the form (fast inline feedback) and by /api/inquiry (authoritative).
 * The enums are built from `inquiryOptions`, so the schema and the copy can't drift.
 */

export type InquiryHelp = (typeof inquiryOptions.help)[number];
export type InquiryStage = (typeof inquiryOptions.stage)[number];
export type InquiryBudget = (typeof inquiryOptions.budget)[number];

/** Submissions faster than this (from first focus to send) are treated as bots. */
export const MIN_ELAPSED_MS = 3000;

const short = (max = 300) => z.string().max(max);

/** One attribution touch, as written by components/analytics/attribution.ts. Unknown keys are stripped. */
export const touchSchema = z.object({
  source: short(),
  medium: short(),
  campaign: short().optional(),
  term: short().optional(),
  content: short().optional(),
  click_id_type: short(40).optional(),
  click_id: short(500).optional(),
  referrer: short(2000).optional(),
  landing_page: short(2000),
  ts: z.number().finite(),
});

export const inquirySchema = z.object({
  /** Generated once per form fill in the browser and reused on retries, so downstream emails dedupe. */
  submissionId: z.uuid({ error: "Missing submission ID. Please reload the page." }),

  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter your name." })
    .max(120, { error: "Please keep your name under 120 characters." }),
  company: z.string().trim().max(160, { error: "Please keep the business name under 160 characters." }).default(""),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Please enter a valid email address." }).max(254, { error: "That email address is too long." })),

  help: z.enum(inquiryOptions.help, { error: "Please choose an option." }),
  budget: z.enum(inquiryOptions.budget, { error: "Please choose a budget range." }),
  stage: z.enum(inquiryOptions.stage, { error: "Please choose where you are in the process." }),

  project: z
    .string()
    .trim()
    .min(10, { error: "A sentence or two is plenty, but please tell us a little more (10+ characters)." })
    .max(5000, { error: "Please keep this under 5,000 characters." }),

  marketingOptIn: z.boolean().default(false),

  attribution: z
    .object({
      first: touchSchema.nullish(),
      last: touchSchema.nullish(),
    })
    .default({}),

  // Spam signals. These are checked by the route, never forwarded.
  /** Honeypot. Humans never see it, so it must be empty. */
  website: z.string().max(2000).default(""),
  /** Milliseconds from the first focus in the form to submit. */
  elapsedMs: z.number().finite().nonnegative().default(0),
  /** Cloudflare Turnstile token (only when the widget is enabled). */
  turnstileToken: z.string().max(2048).optional(),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

/** Fields that reach n8n: everything except the spam signals. */
export type InquiryFields = Omit<Inquiry, "website" | "elapsedMs" | "turnstileToken">;

export type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

/** First error message per field, keyed by field name, for inline display. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof InquiryInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
