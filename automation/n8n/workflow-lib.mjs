/**
 * Logic for the n8n Code nodes in "Adbyrd – Website Inquiry".
 *
 * build-n8n-workflow.mjs inlines this file (import lines and `export` keywords
 * removed) together with ../emails/render.mjs into the Code nodes, so it must
 * stay plain JS with no imports other than render.mjs.
 * Tests: workflow-lib.test.mjs.
 */
import { escapeHtml, nl2br, splitName, formatWhen } from "../emails/render.mjs";

export const PLACEHOLDER = "REPLACE_ME";
export const CONFIG_KEYS = [
  "HUBSPOT_PORTAL_ID",
  "SUPPORT_NOTIFY_TO",
  "MAIL_FROM_ACK",
  "MAIL_FROM_NOTIFY",
  "REPLY_TO_ACK",
  "SITE_URL",
  "TIMEZONE",
];

/** Config keys that are empty or still hold the REPLACE_ME placeholder. */
export function findPlaceholders(config) {
  return CONFIG_KEYS.filter((k) => {
    const v = config?.[k];
    return v === undefined || v === null || String(v).trim() === "" || String(v).includes(PLACEHOLDER);
  });
}

/** An Error whose message carries the raw payload, so the Error Workflow can email it to support. */
export function errorWithPayload(message, payload) {
  let raw;
  try {
    raw = JSON.stringify(payload, null, 2);
  } catch {
    raw = String(payload);
  }
  return new Error(`${message}\n\nPAYLOAD:${raw}`);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/**
 * Defense in depth: the site already validated with zod. This makes sure the
 * webhook only acts on well-formed inquiries even if something else calls it.
 */
export function validatePayload(p, options) {
  const errors = [];
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  if (!p || typeof p !== "object" || Array.isArray(p)) return { valid: false, errors: ["body must be a JSON object"] };

  if (!UUID.test(str(p.submissionId))) errors.push("submissionId");
  const name = str(p.name);
  if (name.length < 1 || name.length > 120) errors.push("name");
  const email = str(p.email).toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) errors.push("email");
  if (p.company !== undefined && (typeof p.company !== "string" || p.company.length > 160)) errors.push("company");
  if (!options.help.includes(p.help)) errors.push("help");
  if (!options.budget.includes(p.budget)) errors.push("budget");
  if (!options.stage.includes(p.stage)) errors.push("stage");
  const project = str(p.project);
  if (project.length < 10 || project.length > 5000) errors.push("project");
  if (p.marketingOptIn !== undefined && typeof p.marketingOptIn !== "boolean") errors.push("marketingOptIn");
  if (Number.isNaN(Date.parse(p.submittedAt))) errors.push("submittedAt");

  if (errors.length) return { valid: false, errors };
  return {
    valid: true,
    errors: [],
    payload: {
      ...p,
      name,
      email,
      company: str(p.company),
      project,
      marketingOptIn: p.marketingOptIn === true,
      attribution: p.attribution && typeof p.attribution === "object" ? p.attribution : {},
    },
  };
}

/* ---------------- HubSpot ---------------- */

/** Properties read back from an existing contact so the rules below can protect them. */
export const HUBSPOT_READ_PROPS = [
  "lifecyclestage",
  "hs_lead_status",
  "adbyrd_marketing_opt_in",
  "adbyrd_first_touch_source",
  "adbyrd_first_touch_medium",
  "adbyrd_first_touch_campaign",
  "adbyrd_landing_page",
];

/** Never written on the 409-conflict fallback, where we couldn't read the contact first. */
const PROTECTED = new Set(HUBSPOT_READ_PROPS);

export function hubspotSearchBody(email) {
  return {
    filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
    properties: HUBSPOT_READ_PROPS,
    limit: 1,
  };
}

/** Normalizes the "HubSpot: Find contact" HTTP response (full response, never-error mode). */
export function readFind(resp) {
  const status = resp?.statusCode;
  if (status !== 200 || !resp?.body) return { ok: false, contact: null, status: status ?? "network" };
  const hit = resp.body.results?.[0];
  return { ok: true, contact: hit ? { id: String(hit.id), properties: hit.properties ?? {} } : null };
}

const empty = (v) => v === undefined || v === null || String(v).trim() === "";

/**
 * Builds the contact properties for a create or an update.
 * Returning contacts keep what the team has already set:
 *  - lifecyclestage → "lead" only when new, empty, or still "subscriber" (never a downgrade)
 *  - hs_lead_status → "NEW" only when new or empty (keeps "In progress", "Connected", …)
 *  - adbyrd_marketing_opt_in → only ever written as "true"; an unticked box never clears it
 *  - first-touch fields and landing page → only when empty (first touch is first touch)
 *  - everything else (service, budget, stage, description, last touch) → latest inquiry wins;
 *    the Note on the contact keeps the full history
 */
export function prepareContact(payload, find) {
  const existing = find?.contact ?? null;
  const cur = existing?.properties ?? {};
  const { first, last } = splitName(payload.name);
  const a = payload.attribution ?? {};
  const ft = a.first ?? null;
  const lt = a.last ?? null;
  const cap = (v, n = 255) => (v === undefined || v === null ? "" : String(v).slice(0, n));

  const props = {
    email: payload.email,
    firstname: first,
    adbyrd_service_interest: payload.help,
    adbyrd_budget_range: payload.budget,
    adbyrd_project_stage: payload.stage,
    adbyrd_project_description: cap(payload.project, 65000),
    adbyrd_last_submission_id: payload.submissionId,
  };
  if (last) props.lastname = last;
  if (payload.company) props.company = cap(payload.company, 160);

  if (lt) {
    props.adbyrd_last_touch_source = cap(lt.source);
    props.adbyrd_last_touch_medium = cap(lt.medium);
    props.adbyrd_last_touch_campaign = cap(lt.campaign);
  }

  const setIfEmpty = (key, value) => {
    if (!empty(value) && (!existing || empty(cur[key]))) props[key] = value;
  };
  if (ft) {
    setIfEmpty("adbyrd_first_touch_source", cap(ft.source));
    setIfEmpty("adbyrd_first_touch_medium", cap(ft.medium));
    setIfEmpty("adbyrd_first_touch_campaign", cap(ft.campaign));
  }
  setIfEmpty("adbyrd_landing_page", cap(ft?.landing_page ?? lt?.landing_page, 2000));

  if (!existing || empty(cur.lifecyclestage) || cur.lifecyclestage === "subscriber") props.lifecyclestage = "lead";
  if (!existing || empty(cur.hs_lead_status)) props.hs_lead_status = "NEW";
  if (payload.marketingOptIn === true) props.adbyrd_marketing_opt_in = "true";

  return {
    mode: existing ? "update" : "create",
    contactId: existing?.id ?? null,
    lookupFailed: find ? !find.ok : true,
    properties: props,
  };
}

/**
 * The create call returned 409 (the contact exists but search didn't find it,
 * e.g. HubSpot's search index lagging a few seconds). Fall back to an update
 * by the existing ID, without the protected fields we couldn't read.
 */
export function conflictUpdate(resp, prepared) {
  if (resp?.statusCode !== 409) return null;
  const msg = String(resp.body?.message ?? "");
  const id = msg.match(/Existing ID:\s*(\d+)/i)?.[1];
  if (!id) return null;
  const properties = Object.fromEntries(Object.entries(prepared.properties).filter(([k]) => !PROTECTED.has(k)));
  if (prepared.properties.adbyrd_marketing_opt_in === "true") properties.adbyrd_marketing_opt_in = "true";
  return { mode: "update", contactId: id, lookupFailed: prepared.lookupFailed, properties };
}

/** Normalizes the create/update response into the CRM status the emails use. */
export function contactResult(resp, mode) {
  const ok = (resp?.statusCode === 200 || resp?.statusCode === 201) && resp?.body?.id;
  return ok
    ? { contactOk: true, contactId: String(resp.body.id), created: mode === "create", status: resp.statusCode }
    : {
        contactOk: false,
        contactId: null,
        created: false,
        status: resp?.statusCode ?? "network",
        message: String(resp?.body?.message ?? resp?.error?.message ?? "no response").slice(0, 500),
      };
}

/** Note on the contact: the full inquiry plus attribution. hs_timestamp is required by HubSpot. */
export function buildNote(payload, contactId, timeZone) {
  const a = payload.attribution ?? {};
  const touch = (t) =>
    t
      ? [
          `${t.source} / ${t.medium}`,
          t.campaign && `campaign ${t.campaign}`,
          t.click_id_type && `click ID ${t.click_id_type}`,
          t.landing_page && `landed on ${t.landing_page}`,
          t.referrer && `from ${t.referrer}`,
        ]
          .filter(Boolean)
          .join(" · ")
      : "—";
  const row = (k, v) => `<strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}<br>`;
  const body =
    `<p><strong>Website inquiry ${escapeHtml(payload.submissionId)}</strong><br>` +
    `${escapeHtml(formatWhen(payload.submittedAt, timeZone))}</p>` +
    `<p>` +
    row("Name", payload.name) +
    row("Business", payload.company || "—") +
    row("Email", payload.email) +
    row("Service", payload.help) +
    row("Budget", payload.budget) +
    row("Stage", payload.stage) +
    row("Marketing opt-in", payload.marketingOptIn ? "Yes" : "No") +
    `</p><p><strong>Message</strong><br>${nl2br(payload.project)}</p>` +
    `<p>` +
    row("First touch", touch(a.first)) +
    row("Last touch", touch(a.last)) +
    row("Page", payload.pageUrl || "—") +
    `</p>`;
  return {
    properties: { hs_timestamp: payload.submittedAt, hs_note_body: body },
    associations: [
      {
        to: { id: String(contactId) },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
      },
    ],
  };
}

/* ---------------- Resend ---------------- */

export const MAX_RETRIES = 3;

/**
 * Decides what to do with a Resend response (HTTP node in full-response,
 * never-error mode, with "continue on error" for network failures).
 * Retries only 429 / 5xx / network errors, up to MAX_RETRIES times with
 * backoff of 2s, 4s, 8s. A 4xx is never retried.
 */
export function classifySend(resp, attempt) {
  const status = resp?.statusCode;
  if (typeof status === "number" && status >= 200 && status < 300) {
    return { action: "sent", status, id: resp.body?.id ?? null, attempt };
  }
  const retryable = status === undefined || status === 429 || status >= 500;
  const detail = String(resp?.body?.message ?? resp?.error?.message ?? resp?.statusMessage ?? "no response").slice(0, 500);
  if (retryable && attempt < MAX_RETRIES) {
    return { action: "retry", status: status ?? "network", waitSeconds: 2 ** (attempt + 1), attempt, detail };
  }
  return { action: "failed", status: status ?? "network", attempt, detail };
}
