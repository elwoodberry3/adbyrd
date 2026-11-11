import {
  buildNote,
  classifySend,
  conflictUpdate,
  contactResult,
  errorWithPayload,
  findPlaceholders,
  prepareContact,
  readFind,
  validatePayload,
} from "./workflow-lib.mjs";
import { SAMPLE_CONFIG, SAMPLE_PAYLOAD } from "../scripts/preview-emails.mjs";
import { loadSite } from "../scripts/lib/site.mjs";

const found = (properties = {}) => ({ ok: true, contact: { id: "55", properties } });
const notFound = { ok: true, contact: null };

describe("findPlaceholders", () => {
  it("flags REPLACE_ME and empty values", () => {
    expect(findPlaceholders(SAMPLE_CONFIG)).toEqual([]);
    expect(findPlaceholders({ ...SAMPLE_CONFIG, HUBSPOT_PORTAL_ID: "REPLACE_ME", SITE_URL: "" })).toEqual([
      "HUBSPOT_PORTAL_ID",
      "SITE_URL",
    ]);
  });
});

describe("validatePayload", () => {
  let options;
  beforeAll(async () => {
    options = (await loadSite()).inquiryOptions;
  });

  it("accepts the site's payload", () => {
    const r = validatePayload(SAMPLE_PAYLOAD, options);
    expect(r.valid).toBe(true);
    expect(r.payload.email).toBe(SAMPLE_PAYLOAD.email);
  });

  it("rejects values outside the site's options and malformed fields", () => {
    const r = validatePayload({ ...SAMPLE_PAYLOAD, help: "Hack", email: "x", submissionId: "1", project: "" }, options);
    expect(r.valid).toBe(false);
    expect(r.errors.sort()).toEqual(["email", "help", "project", "submissionId"]);
  });

  it("rejects non-objects", () => {
    expect(validatePayload(null, options).valid).toBe(false);
    expect(validatePayload([], options).valid).toBe(false);
  });
});

describe("prepareContact: returning-contact rules", () => {
  it("creates a new contact as a NEW lead", () => {
    const r = prepareContact(SAMPLE_PAYLOAD, notFound);
    expect(r.mode).toBe("create");
    expect(r.properties).toMatchObject({
      email: SAMPLE_PAYLOAD.email,
      firstname: "Dana",
      lastname: "O'Neil-Ramirez",
      company: SAMPLE_PAYLOAD.company,
      lifecyclestage: "lead",
      hs_lead_status: "NEW",
      adbyrd_marketing_opt_in: "true",
      adbyrd_first_touch_source: "google",
      adbyrd_last_touch_source: "facebook",
      adbyrd_last_submission_id: SAMPLE_PAYLOAD.submissionId,
    });
  });

  it("never downgrades lifecycle stage or overwrites lead status", () => {
    const r = prepareContact(SAMPLE_PAYLOAD, found({ lifecyclestage: "opportunity", hs_lead_status: "IN_PROGRESS" }));
    expect(r.mode).toBe("update");
    expect(r.contactId).toBe("55");
    expect(r.properties).not.toHaveProperty("lifecyclestage");
    expect(r.properties).not.toHaveProperty("hs_lead_status");
  });

  it("promotes a subscriber to lead and fills an empty lead status", () => {
    const r = prepareContact(SAMPLE_PAYLOAD, found({ lifecyclestage: "subscriber", hs_lead_status: "" }));
    expect(r.properties.lifecyclestage).toBe("lead");
    expect(r.properties.hs_lead_status).toBe("NEW");
  });

  it("never writes marketing opt-in as false", () => {
    const r = prepareContact({ ...SAMPLE_PAYLOAD, marketingOptIn: false }, found({ adbyrd_marketing_opt_in: "true" }));
    expect(r.properties).not.toHaveProperty("adbyrd_marketing_opt_in");
    const fresh = prepareContact({ ...SAMPLE_PAYLOAD, marketingOptIn: false }, notFound);
    expect(fresh.properties).not.toHaveProperty("adbyrd_marketing_opt_in");
  });

  it("keeps an existing first touch but updates the last touch", () => {
    const r = prepareContact(
      SAMPLE_PAYLOAD,
      found({ adbyrd_first_touch_source: "linkedin", adbyrd_first_touch_medium: "social", adbyrd_landing_page: "/about" }),
    );
    expect(r.properties).not.toHaveProperty("adbyrd_first_touch_source");
    expect(r.properties).not.toHaveProperty("adbyrd_first_touch_medium");
    expect(r.properties).not.toHaveProperty("adbyrd_landing_page");
    expect(r.properties.adbyrd_first_touch_campaign).toBe("gbp_listing"); // was empty
    expect(r.properties.adbyrd_last_touch_source).toBe("facebook");
  });

  it("doesn't blank an existing company or last name", () => {
    const r = prepareContact({ ...SAMPLE_PAYLOAD, name: "Dana", company: "" }, found({}));
    expect(r.properties).not.toHaveProperty("company");
    expect(r.properties).not.toHaveProperty("lastname");
  });

  it("treats a failed lookup as a create", () => {
    const r = prepareContact(SAMPLE_PAYLOAD, readFind({ statusCode: 500, body: {} }));
    expect(r).toMatchObject({ mode: "create", lookupFailed: true });
  });
});

describe("conflictUpdate (409 on create)", () => {
  it("retries as an update without the protected fields", () => {
    const prepared = prepareContact(SAMPLE_PAYLOAD, notFound);
    const r = conflictUpdate({ statusCode: 409, body: { message: "Contact already exists. Existing ID: 777" } }, prepared);
    expect(r.mode).toBe("update");
    expect(r.contactId).toBe("777");
    for (const k of ["lifecyclestage", "hs_lead_status", "adbyrd_first_touch_source", "adbyrd_landing_page"]) {
      expect(r.properties).not.toHaveProperty(k);
    }
    expect(r.properties.adbyrd_marketing_opt_in).toBe("true");
  });

  it("ignores other statuses", () => {
    expect(conflictUpdate({ statusCode: 400, body: {} }, prepareContact(SAMPLE_PAYLOAD, notFound))).toBeNull();
  });
});

describe("contactResult and buildNote", () => {
  it("reads success and failure", () => {
    expect(contactResult({ statusCode: 201, body: { id: 9 } }, "create")).toMatchObject({ contactOk: true, contactId: "9", created: true });
    expect(contactResult({ statusCode: 400, body: { message: "bad property" } }, "update")).toMatchObject({
      contactOk: false,
      message: "bad property",
    });
    expect(contactResult({ error: { message: "ECONNRESET" } }, "update")).toMatchObject({ contactOk: false, status: "network" });
  });

  it("sets hs_timestamp and escapes the note body", () => {
    const note = buildNote({ ...SAMPLE_PAYLOAD, project: "<img src=x onerror=alert(1)>\nok" }, "55", "America/Detroit");
    expect(note.properties.hs_timestamp).toBe(SAMPLE_PAYLOAD.submittedAt);
    expect(note.properties.hs_note_body).toContain("&lt;img src=x onerror=alert(1)&gt;<br>\nok");
    expect(note.properties.hs_note_body).not.toContain("<img");
    expect(note.associations[0]).toEqual({
      to: { id: "55" },
      types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
    });
  });
});

describe("classifySend (Resend retry policy)", () => {
  it("passes 2xx", () => {
    expect(classifySend({ statusCode: 200, body: { id: "em_1" } }, 0)).toMatchObject({ action: "sent", id: "em_1" });
  });

  it("retries 429, 5xx and network errors with 2s/4s/8s backoff, three times", () => {
    expect(classifySend({ statusCode: 429, body: {} }, 0)).toMatchObject({ action: "retry", waitSeconds: 2 });
    expect(classifySend({ statusCode: 503, body: {} }, 1)).toMatchObject({ action: "retry", waitSeconds: 4 });
    expect(classifySend({ error: { message: "ETIMEDOUT" } }, 2)).toMatchObject({ action: "retry", waitSeconds: 8 });
    expect(classifySend({ statusCode: 500, body: {} }, 3)).toMatchObject({ action: "failed" });
  });

  it("never retries a 4xx", () => {
    expect(classifySend({ statusCode: 422, body: { message: "Invalid `to` field" } }, 0)).toMatchObject({
      action: "failed",
      status: 422,
      detail: "Invalid `to` field",
    });
    expect(classifySend({ statusCode: 409, body: {} }, 0).action).toBe("failed");
  });
});

describe("errorWithPayload", () => {
  it("carries the payload after a PAYLOAD: marker", () => {
    const e = errorWithPayload("boom", { a: 1 });
    expect(e.message).toBe('boom\n\nPAYLOAD:{\n  "a": 1\n}');
  });
});
