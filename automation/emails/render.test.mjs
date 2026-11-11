import { escapeHtml, fill, nl2br, oneLine, renderInquiryEmails, splitName, formatWhen } from "./render.mjs";
import { SAMPLE_CONFIG, SAMPLE_PAYLOAD, loadTemplates } from "../scripts/preview-emails.mjs";
import { loadSite } from "../scripts/lib/site.mjs";

const XSS = `<script>alert("x")</script> & 'quotes' \`tick\``;

describe("escaping helpers", () => {
  it("escapes every HTML-significant character", () => {
    expect(escapeHtml(XSS)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quotes&#39; &#96;tick&#96;",
    );
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(42)).toBe("42");
  });

  it("converts newlines to <br> only after escaping", () => {
    expect(nl2br("a<b>\r\nc\nd")).toBe("a&lt;b&gt;<br>\nc<br>\nd");
    // A literal "<br>" typed by the user stays inert text
    expect(nl2br("<br>")).toBe("&lt;br&gt;");
  });

  it("fill escapes plain tokens, trusts *Html tokens, and throws on unknown tokens", () => {
    expect(fill("<p>{{name}}</p>{{rowHtml}}", { name: "<i>", rowHtml: "<b>ok</b>" })).toBe("<p>&lt;i&gt;</p><b>ok</b>");
    expect(fill("{{name}}", { name: "<i>" }, { html: false })).toBe("<i>");
    expect(() => fill("{{missing}}", {})).toThrow(/missing/);
  });

  it("oneLine strips header-breaking characters", () => {
    expect(oneLine("Hi\r\nBcc: evil@example.com")).toBe("Hi Bcc: evil@example.com");
  });

  it("splits a name on the first space", () => {
    expect(splitName("Dana")).toEqual({ first: "Dana", last: "" });
    expect(splitName("  Dana  Van der Berg ")).toEqual({ first: "Dana", last: "Van der Berg" });
  });

  it("formats times in the configured zone", () => {
    expect(formatWhen("2026-11-10T15:42:00.000Z", "America/Detroit")).toMatch(/10:42\sAM EST/);
  });
});

describe("renderInquiryEmails", () => {
  let site;
  let templates;
  beforeAll(async () => {
    site = (await loadSite()).site;
    templates = await loadTemplates();
  });

  const render = (over = {}, crm = { contactOk: true, contactId: "98765", created: true, noteOk: true }) =>
    renderInquiryEmails({ payload: { ...SAMPLE_PAYLOAD, ...over }, config: SAMPLE_CONFIG, site, templates, crm });

  it("fills every token in all four templates", () => {
    const out = render();
    for (const part of [out.ack.html, out.ack.text, out.notify.html, out.notify.text]) {
      expect(part).not.toMatch(/\{\{/);
    }
  });

  it("never lets user input through as markup", () => {
    const out = render({ name: XSS, company: XSS, project: `${XSS}\nline two`, pageUrl: XSS });
    for (const html of [out.ack.html, out.notify.html]) {
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    }
    expect(out.notify.html).toContain("&lt;/script&gt; &amp; &#39;quotes&#39; &#96;tick&#96;<br>\nline two");
  });

  it("escapes attribution values", () => {
    const out = render({ attribution: { first: { source: XSS, medium: "x", landing_page: "/", ts: 1 } } });
    expect(out.notify.html).not.toContain("<script>");
  });

  it("builds the acknowledgment request for Resend", () => {
    const { ack } = render();
    expect(ack.subject).toBe("We got your project inquiry, Dana");
    expect(ack.idempotencyKey).toBe(`inquiry-ack/${SAMPLE_PAYLOAD.submissionId}`);
    expect(ack.body).toMatchObject({
      from: SAMPLE_CONFIG.MAIL_FROM_ACK,
      to: [SAMPLE_PAYLOAD.email],
      reply_to: SAMPLE_CONFIG.REPLY_TO_ACK,
      tags: [{ name: "type", value: "inquiry_ack" }],
    });
    expect(ack.html).toContain("https://adbyrd.com/email/icon_w_text.jpg");
    expect(ack.html).toContain("utm_campaign=inquiry_ack");
    for (const step of site.nextSteps) expect(ack.html).toContain(escapeHtml(step.title));
    // Transactional: no unsubscribe or marketing footer
    expect(ack.html.toLowerCase()).not.toContain("unsubscribe");
  });

  it("builds the support notification request for Resend", () => {
    const { notify } = render({}, { contactOk: true, contactId: "98765" });
    expect(notify.subject).toBe(`New inquiry: Dana O'Neil-Ramirez · ${SAMPLE_PAYLOAD.help} · ${SAMPLE_PAYLOAD.budget}`);
    expect(notify.idempotencyKey).toBe(`inquiry-notify/${SAMPLE_PAYLOAD.submissionId}`);
    expect(notify.body).toMatchObject({
      from: SAMPLE_CONFIG.MAIL_FROM_NOTIFY,
      to: [SAMPLE_CONFIG.SUPPORT_NOTIFY_TO],
      reply_to: SAMPLE_PAYLOAD.email,
      tags: [{ name: "type", value: "inquiry_notify" }],
    });
    expect(notify.html).toContain(`mailto:${SAMPLE_PAYLOAD.email}`);
    expect(notify.html).toMatch(/10:42\sAM EST/);
  });

  it("supports a comma-separated support list", () => {
    const out = renderInquiryEmails({
      payload: SAMPLE_PAYLOAD,
      config: { ...SAMPLE_CONFIG, SUPPORT_NOTIFY_TO: "a@example.com, b@example.com" },
      site,
      templates,
      crm: { contactOk: false },
    });
    expect(out.notify.body.to).toEqual(["a@example.com", "b@example.com"]);
  });

  it("shows the HubSpot link when the CRM sync worked", () => {
    const { notify } = render();
    expect(notify.html).toContain("https://app.hubspot.com/contacts/12345678/record/0-1/98765");
    expect(notify.html).not.toContain("CRM sync failed");
  });

  it("shows the warning banner when the CRM sync failed", () => {
    const { notify } = render({}, { contactOk: false });
    expect(notify.html).toContain("CRM sync failed");
    expect(notify.text).toContain("⚠ CRM sync failed");
    expect(notify.html).not.toContain("app.hubspot.com");
  });

  it("keeps header values on one line", () => {
    const { notify, ack } = render({ name: "Dana\r\nBcc: x@example.com" });
    expect(notify.subject).not.toMatch(/[\r\n]/);
    expect(ack.subject).not.toMatch(/[\r\n]/);
  });
});
