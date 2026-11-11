/**
 * Checks the exported n8n workflows: they're up to date with the repo sources,
 * structurally valid, free of secrets, and their Code nodes actually run.
 * The Code nodes are executed with a tiny stand-in for n8n's `$()` / `$input`.
 */
import { readFile } from "node:fs/promises";
import { buildWorkflows, CREDENTIALS, OUT, serialize } from "../scripts/build-n8n-workflow.mjs";
import { SAMPLE_CONFIG, SAMPLE_PAYLOAD } from "../scripts/preview-emails.mjs";

let built;
let main;
let errorWf;
beforeAll(async () => {
  built = await buildWorkflows({});
  main = JSON.parse(await readFile(OUT.main, "utf8"));
  errorWf = JSON.parse(await readFile(OUT.error, "utf8"));
});

/** Runs one Code node. `outputs` maps node name → that node's output json (one item). */
function run(wf, name, { outputs = {}, input = {}, runIndex = 0 } = {}) {
  const n = wf.nodes.find((x) => x.name === name);
  if (!n) throw new Error(`no node ${name}`);
  const $ = (ref) => ({
    first: () => {
      if (!(ref in outputs)) throw new Error(`Node '${ref}' hasn't been executed`);
      return { json: outputs[ref] };
    },
    last: () => ({ json: outputs[ref] }),
    get isExecuted() {
      return ref in outputs;
    },
  });
  const $input = { first: () => ({ json: input }) };
  const fn = new Function("$", "$input", "$runIndex", n.parameters.jsCode);
  const result = fn($, $input, runIndex);
  return result[0].json;
}

describe("workflow exports", () => {
  it("are up to date with the repo sources (run build-n8n-workflow.mjs)", async () => {
    expect(await readFile(OUT.main, "utf8")).toBe(serialize(built.main));
    expect(await readFile(OUT.error, "utf8")).toBe(serialize(built.error));
  });

  it.each(["main", "error"])("%s: every connection points at a real node", (key) => {
    const wf = key === "main" ? main : errorWf;
    const names = new Set(wf.nodes.map((n) => n.name));
    expect(names.size).toBe(wf.nodes.length);
    for (const [from, { main: outs }] of Object.entries(wf.connections)) {
      expect(names.has(from)).toBe(true);
      for (const out of outs) for (const c of out) expect(names.has(c.node)).toBe(true);
    }
  });

  it("reference credentials by name only and contain no secrets", () => {
    const raw = JSON.stringify([main, errorWf]);
    const used = new Set();
    for (const n of [...main.nodes, ...errorWf.nodes]) {
      for (const c of Object.values(n.credentials ?? {})) {
        expect(c.id).toBeNull();
        used.add(c.name);
      }
    }
    expect([...used].sort()).toEqual(Object.values(CREDENTIALS).sort());
    expect(raw).not.toMatch(/pat-[a-z]{2}\d-/i); // HubSpot private app token
    expect(raw).not.toMatch(/\bre_[A-Za-z0-9]{8,}/); // Resend API key
    expect(raw).not.toMatch(/Bearer\s+[A-Za-z0-9]/);
  });

  it("uses the webhook path, header auth and Respond-to-Webhook mode", () => {
    const hook = main.nodes.find((n) => n.name === "Webhook");
    expect(hook.parameters).toMatchObject({
      httpMethod: "POST",
      path: "adbyrd-inquiry",
      authentication: "headerAuth",
      responseMode: "responseNode",
    });
    expect(main.nodes.find((n) => n.name === "Respond 202").parameters.options.responseCode).toBe(202);
  });

  it("keeps HubSpot steps from blocking the support email", () => {
    for (const n of main.nodes.filter((x) => x.name.startsWith("HubSpot:"))) {
      expect(n.onError).toBe("continueRegularOutput");
    }
  });

  it("sends an Idempotency-Key on every Resend call and doesn't use n8n's blanket retry", () => {
    for (const n of [...main.nodes, ...errorWf.nodes].filter((x) => x.name.startsWith("Resend:"))) {
      expect(n.parameters.url).toBe("https://api.resend.com/emails");
      expect(n.parameters.headerParameters.parameters[0].name).toBe("Idempotency-Key");
      expect(n.retryOnFail).toBeUndefined();
    }
  });

  it("keeps REPLACE_ME for the portal ID in the committed export", () => {
    const cfg = main.nodes.find((n) => n.name === "Config").parameters.assignments.assignments;
    expect(cfg.find((a) => a.name === "HUBSPOT_PORTAL_ID").value).toBe("REPLACE_ME");
    expect(cfg.find((a) => a.name === "TIMEZONE").value).toBe("America/Detroit");
  });
});

describe("Code nodes, simulated", () => {
  const webhook = { body: SAMPLE_PAYLOAD, headers: {} };

  it("Validate stops on unfinished config and carries the payload", () => {
    expect(() =>
      run(main, "Validate", { outputs: { Webhook: webhook, Config: { ...SAMPLE_CONFIG, HUBSPOT_PORTAL_ID: "REPLACE_ME" } } }),
    ).toThrow(/HUBSPOT_PORTAL_ID[\s\S]*PAYLOAD:[\s\S]*3f1c9b2e/);
  });

  it("Validate flags a bad payload for the 400 response", () => {
    const out = run(main, "Validate", { outputs: { Webhook: { body: { ...SAMPLE_PAYLOAD, help: "nope" } }, Config: SAMPLE_CONFIG } });
    expect(out).toEqual({ valid: false, errors: ["help"] });
  });

  it("runs the happy path for a returning contact", () => {
    const outputs = { Webhook: webhook, Config: SAMPLE_CONFIG };
    outputs.Validate = run(main, "Validate", { outputs });
    expect(outputs.Validate.valid).toBe(true);
    expect(outputs.Validate.search.filterGroups[0].filters[0].value).toBe(SAMPLE_PAYLOAD.email);

    outputs["Prepare contact"] = run(main, "Prepare contact", {
      outputs,
      input: {
        statusCode: 200,
        body: { results: [{ id: "55", properties: { lifecyclestage: "customer", hs_lead_status: "CONNECTED" } }] },
      },
    });
    expect(outputs["Prepare contact"]).toMatchObject({ mode: "update", contactId: "55" });
    expect(outputs["Prepare contact"].properties).not.toHaveProperty("lifecyclestage");

    outputs["Contact result"] = run(main, "Contact result", { outputs, input: { statusCode: 200, body: { id: "55" } } });
    expect(outputs["Contact result"].crm).toMatchObject({ contactOk: true, contactId: "55", created: false });
    expect(outputs["Contact result"].note.properties.hs_timestamp).toBe(SAMPLE_PAYLOAD.submittedAt);

    outputs["HubSpot: Create note"] = { statusCode: 201, body: { id: "n1" } };
    outputs["Render emails"] = run(main, "Render emails", { outputs });
    const r = outputs["Render emails"];
    expect(r.ack.body.to).toEqual([SAMPLE_PAYLOAD.email]);
    expect(r.notify.html).toContain("/record/0-1/55");

    outputs["Check acknowledgment"] = run(main, "Check acknowledgment", { outputs, input: { statusCode: 200, body: { id: "a1" } } });
    const notify = run(main, "Check notification", { outputs, input: { statusCode: 200, body: { id: "b1" } } });
    const done = run(main, "Finish", { outputs, input: notify });
    expect(done).toMatchObject({ ok: true, ackEmailId: "a1", notifyEmailId: "b1" });
  });

  it("falls back to an update when create hits a 409", () => {
    const outputs = { Webhook: webhook, Config: SAMPLE_CONFIG };
    outputs.Validate = run(main, "Validate", { outputs });
    outputs["Prepare contact"] = run(main, "Prepare contact", { outputs, input: { statusCode: 200, body: { results: [] } } });
    const out = run(main, "Check create", {
      outputs,
      input: { statusCode: 409, body: { message: "Contact already exists. Existing ID: 777" } },
    });
    expect(out).toMatchObject({ next: "update", contactId: "777" });
  });

  it("still renders the support email with a warning when HubSpot is down", () => {
    const outputs = { Webhook: webhook, Config: SAMPLE_CONFIG };
    outputs.Validate = run(main, "Validate", { outputs });
    outputs["Prepare contact"] = run(main, "Prepare contact", { outputs, input: { error: { message: "ECONNREFUSED" } } });
    expect(outputs["Prepare contact"].mode).toBe("create");
    const created = run(main, "Check create", { outputs, input: { statusCode: 503, body: { message: "down" } } });
    outputs["Contact result"] = run(main, "Contact result", { outputs, input: created });
    expect(outputs["Contact result"].crm.contactOk).toBe(false);
    const r = run(main, "Render emails", { outputs });
    expect(r.notify.html).toContain("CRM sync failed");
  });

  it("retries Resend 5xx with $runIndex, then fails into the Error Workflow", () => {
    const outputs = { Validate: { payload: SAMPLE_PAYLOAD } };
    expect(run(main, "Check notification", { outputs, input: { statusCode: 502, body: {} }, runIndex: 0 })).toMatchObject({
      action: "retry",
      waitSeconds: 2,
    });
    expect(() => run(main, "Check notification", { outputs, input: { statusCode: 502, body: {} }, runIndex: 3 })).toThrow(
      /PAYLOAD:/,
    );
  });

  it("a failed acknowledgment doesn't stop the notification, but Finish reports it", () => {
    const ack = run(main, "Check acknowledgment", { input: { statusCode: 422, body: { message: "bad to" } } });
    expect(ack.action).toBe("failed");
    expect(() =>
      run(main, "Finish", {
        outputs: {
          Validate: { payload: SAMPLE_PAYLOAD, config: SAMPLE_CONFIG },
          "Check acknowledgment": ack,
          "Contact result": { crm: { contactOk: true } },
        },
        input: { action: "sent", id: "b1" },
      }),
    ).toThrow(/Acknowledgment email[\s\S]*PAYLOAD:/);
  });

  it("the error workflow builds an alert with the failing node and the payload", () => {
    const err = new Error("x");
    err.message = `Support notification email failed (422): bad\n\nPAYLOAD:${JSON.stringify({ name: "<b>Dana</b>" })}`;
    const out = run(errorWf, "Build alert", {
      outputs: {
        "Error Trigger": {
          execution: { id: "101", url: "https://n8n.example/execution/101", lastNodeExecuted: "Check notification", error: { message: err.message } },
          workflow: { name: "Adbyrd – Website Inquiry" },
        },
        Config: { SUPPORT_NOTIFY_TO: "a@example.com, b@example.com", MAIL_FROM_NOTIFY: "Alerts <n@example.com>" },
      },
    });
    expect(out.idempotencyKey).toBe("inquiry-error/101");
    expect(out.body.to).toEqual(["a@example.com", "b@example.com"]);
    expect(out.body.subject).toContain("Check notification");
    expect(out.body.html).toContain("https://n8n.example/execution/101");
    expect(out.body.html).toContain("&lt;b&gt;Dana&lt;/b&gt;");
    expect(out.body.html).not.toContain("<b>Dana</b>");
  });
});
