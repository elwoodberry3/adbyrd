#!/usr/bin/env node
/**
 * Creates the "Adbyrd Website" contact property group and the adbyrd_*
 * properties the inquiry workflow writes. Safe to run again: whatever exists is
 * left alone, except that dropdown options are synced to lib/content.ts.
 *
 *   HUBSPOT_TOKEN=pat-na1-… node automation/hubspot/create-properties.mjs [--dry-run]
 *
 * Private app scopes needed (HubSpot → Settings → Integrations → Private Apps):
 *   crm.objects.contacts.read   crm.objects.contacts.write
 *   crm.schemas.contacts.read   crm.schemas.contacts.write
 * The n8n workflow uses the same app token (search, create/update, notes).
 *
 * Dropdown options come straight from project/lib/content.ts (inquiryOptions),
 * so the form, the site's zod schema and HubSpot always agree. Option
 * value = label = the exact text on the site.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSite } from "../scripts/lib/site.mjs";

export const GROUP = { name: "adbyrd_website", label: "Adbyrd Website", displayOrder: -1 };

const text = (name, label, description) => ({ name, label, description, type: "string", fieldType: "text" });
const select = (name, label, description, values) => ({
  name,
  label,
  description,
  type: "enumeration",
  fieldType: "select",
  options: values.map((v, i) => ({ label: v, value: v, displayOrder: i, hidden: false })),
});

/** Every property the workflow writes, built from the site's inquiry options. */
export function buildPropertyDefinitions(inquiryOptions) {
  return [
    select("adbyrd_service_interest", "Service interest", "What can we help you with? (website inquiry form)", inquiryOptions.help),
    select("adbyrd_budget_range", "Budget range", "Estimated project budget (website inquiry form)", inquiryOptions.budget),
    select("adbyrd_project_stage", "Project stage", "Where are you in the process? (website inquiry form)", inquiryOptions.stage),
    {
      name: "adbyrd_project_description",
      label: "Project description (latest)",
      description: "Message from the most recent website inquiry. Earlier inquiries are kept as Notes on the contact.",
      type: "string",
      fieldType: "textarea",
    },
    text("adbyrd_first_touch_source", "First touch source", "Source of the visitor's first recorded visit"),
    text("adbyrd_first_touch_medium", "First touch medium", "Medium of the visitor's first recorded visit"),
    text("adbyrd_first_touch_campaign", "First touch campaign", "Campaign of the visitor's first recorded visit"),
    text("adbyrd_last_touch_source", "Last touch source", "Source of the last non-direct visit before the latest inquiry"),
    text("adbyrd_last_touch_medium", "Last touch medium", "Medium of the last non-direct visit before the latest inquiry"),
    text("adbyrd_last_touch_campaign", "Last touch campaign", "Campaign of the last non-direct visit before the latest inquiry"),
    text("adbyrd_landing_page", "Landing page", "First landing page on adbyrd.com"),
    text("adbyrd_last_submission_id", "Last submission ID", "submissionId of the latest website inquiry (join key for n8n, Resend and analytics)"),
    {
      name: "adbyrd_marketing_opt_in",
      label: "Marketing opt-in (website)",
      description: "Ticked 'Send me occasional tips and updates' on a website inquiry. The workflow only ever sets this to Yes.",
      type: "bool",
      fieldType: "booleancheckbox",
      options: [
        { label: "Yes", value: "true", displayOrder: 0, hidden: false },
        { label: "No", value: "false", displayOrder: 1, hidden: false },
      ],
    },
  ].map((p) => ({ ...p, groupName: GROUP.name }));
}

const API = "https://api.hubapi.com/crm/v3/properties/contacts";

async function hs(token, method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function sameOptions(a = [], b = []) {
  const key = (o) => o.map((x) => x.value).join("\u0000");
  return key(a) === key(b);
}

export async function run({ token, dryRun = false, log = console.log }) {
  const { inquiryOptions } = await loadSite();
  const defs = buildPropertyDefinitions(inquiryOptions);

  const g = await hs(token, "GET", `${API}/groups/${GROUP.name}`);
  if (g.status === 404) {
    log(`+ group ${GROUP.name}`);
    if (!dryRun) {
      const r = await hs(token, "POST", `${API}/groups`, GROUP);
      if (r.status >= 300) throw new Error(`create group failed (${r.status}): ${r.data.message}`);
    }
  } else if (g.status === 200) log(`= group ${GROUP.name}`);
  else throw new Error(`read group failed (${g.status}): ${g.data.message ?? "check the token and scopes"}`);

  for (const def of defs) {
    const cur = await hs(token, "GET", `${API}/${def.name}`);
    if (cur.status === 404) {
      log(`+ ${def.name}`);
      if (!dryRun) {
        const r = await hs(token, "POST", API, def);
        if (r.status >= 300) throw new Error(`create ${def.name} failed (${r.status}): ${r.data.message}`);
      }
    } else if (cur.status === 200) {
      if (def.type === "enumeration" && !sameOptions(cur.data.options, def.options)) {
        log(`~ ${def.name} (options synced to lib/content.ts)`);
        if (!dryRun) {
          const r = await hs(token, "PATCH", `${API}/${def.name}`, { options: def.options });
          if (r.status >= 300) throw new Error(`update ${def.name} failed (${r.status}): ${r.data.message}`);
        }
      } else log(`= ${def.name}`);
    } else throw new Error(`read ${def.name} failed (${cur.status}): ${cur.data.message}`);
  }
  log(dryRun ? "dry run: nothing was changed" : "done");
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    console.error("Set HUBSPOT_TOKEN to the private app's access token.");
    process.exit(1);
  }
  run({ token, dryRun: process.argv.includes("--dry-run") }).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
