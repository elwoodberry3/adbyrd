import { buildPropertyDefinitions, GROUP } from "./create-properties.mjs";
import { HUBSPOT_READ_PROPS, prepareContact } from "../n8n/workflow-lib.mjs";
import { SAMPLE_PAYLOAD } from "../scripts/preview-emails.mjs";
import { loadSite } from "../scripts/lib/site.mjs";

let options;
let defs;
beforeAll(async () => {
  options = (await loadSite()).inquiryOptions;
  defs = buildPropertyDefinitions(options);
});

const byName = (n) => defs.find((d) => d.name === n);

describe("HubSpot property definitions", () => {
  it("creates every property the brief lists, all in the Adbyrd Website group", () => {
    expect(defs.map((d) => d.name).sort()).toEqual(
      [
        "adbyrd_service_interest",
        "adbyrd_budget_range",
        "adbyrd_project_stage",
        "adbyrd_project_description",
        "adbyrd_first_touch_source",
        "adbyrd_first_touch_medium",
        "adbyrd_first_touch_campaign",
        "adbyrd_last_touch_source",
        "adbyrd_last_touch_medium",
        "adbyrd_last_touch_campaign",
        "adbyrd_landing_page",
        "adbyrd_last_submission_id",
        "adbyrd_marketing_opt_in",
      ].sort(),
    );
    for (const d of defs) expect(d.groupName).toBe(GROUP.name);
  });

  it.each([
    ["adbyrd_service_interest", "help"],
    ["adbyrd_budget_range", "budget"],
    ["adbyrd_project_stage", "stage"],
  ])("%s options match inquiryOptions.%s exactly (parity with lib/content.ts)", (prop, key) => {
    expect(byName(prop).options.map((o) => o.value)).toEqual(options[key]);
    expect(byName(prop).options.map((o) => o.label)).toEqual(options[key]);
  });

  it("uses the right field types", () => {
    expect(byName("adbyrd_project_description").fieldType).toBe("textarea");
    expect(byName("adbyrd_marketing_opt_in")).toMatchObject({ type: "bool", fieldType: "booleancheckbox" });
  });

  it("covers every custom property the workflow writes or reads", () => {
    const written = Object.keys(prepareContact({ ...SAMPLE_PAYLOAD, marketingOptIn: true }, { ok: true, contact: null }).properties);
    const custom = [...written, ...HUBSPOT_READ_PROPS].filter((k) => k.startsWith("adbyrd_"));
    for (const k of custom) expect(byName(k), k).toBeTruthy();
  });
});
