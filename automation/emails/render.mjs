/**
 * Email rendering for the "Adbyrd – Website Inquiry" n8n workflow.
 *
 * This file is the single source of truth. build-n8n-workflow.mjs inlines it
 * (minus `export` keywords) into the "Render emails" Code node, so it must stay
 * dependency-free: no imports and only plain JS that n8n's Code node can run.
 *
 * Safety rule: every user-supplied value is HTML-escaped before it reaches a
 * template. Newlines become <br> only AFTER escaping. Tokens ending in `Html`
 * are pre-built fragments (already escaped here); every other token is
 * escaped on injection.
 */

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" };

export function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"'`]/g, (c) => ESCAPES[c]);
}

/** Escape first, then turn line breaks into <br>. */
export function nl2br(value) {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>\n");
}

/** Strip CR/LF from header-like values (subjects, names in From lines). */
export function oneLine(value, max = 200) {
  return String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, max);
}

/**
 * Replaces {{token}} placeholders. In HTML mode, values are escaped unless the
 * token name ends in "Html". Unknown tokens throw, so a template typo fails
 * loudly (and lands in the Error Workflow) instead of shipping "{{oops}}".
 */
export function fill(template, vars, { html = true } = {}) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`Email template token not provided: ${key}`);
    const v = vars[key];
    if (!html || key.endsWith("Html")) return v === null || v === undefined ? "" : String(v);
    return escapeHtml(v);
  });
}

export function splitName(name) {
  const clean = oneLine(name, 120);
  const i = clean.indexOf(" ");
  return i === -1 ? { first: clean, last: "" } : { first: clean.slice(0, i), last: clean.slice(i + 1).trim() };
}

export function formatWhen(iso, timeZone) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso ?? "");
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

export function hubspotContactUrl(portalId, contactId) {
  return `https://app.hubspot.com/contacts/${encodeURIComponent(portalId)}/record/0-1/${encodeURIComponent(contactId)}`;
}

/* ---------- shared fragment styles (inline, email-safe) ---------- */

const FONT = "Inter, Sora, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const C = {
  ink: "#121726",
  night: "#1c2433",
  steel: "#4f5f6e",
  mist: "#a8bfc0",
  ember: "#e07a3f",
  ember2: "#c9642b",
  fog: "#e9ecea",
  ivory: "#f6f4ef",
  slate: "#566170",
  line: "#e2e3dd",
};

function kvRowsHtml(rows) {
  return rows
    .map(
      ([label, valueHtml], i) =>
        `<tr><td class="kv-l dm-bd dm-muted" valign="top" style="padding:12px 16px 12px 0;${i ? `border-top:1px solid ${C.line};` : ""}width:150px;font-family:${FONT};font-size:12px;line-height:18px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${C.slate};">${escapeHtml(label)}</td>` +
        `<td class="dm-bd dm-text" valign="top" style="padding:12px 0;${i ? `border-top:1px solid ${C.line};` : ""}font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink};word-break:break-word;">${valueHtml}</td></tr>`,
    )
    .join("\n");
}

function kvRowsText(rows) {
  return rows.map(([label, value]) => `${label}: ${value}`).join("\n");
}

function nextStepsHtml(steps) {
  return steps
    .map((s, i) => {
      const badge = i === 0 ? `background-color:${C.ember};color:${C.ink};` : `background-color:${C.night};color:${C.mist};`;
      return (
        `<tr><td valign="top" width="52" style="padding:0 0 18px 0;">` +
        `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" valign="middle" width="36" height="36" style="${badge}width:36px;height:36px;border-radius:7px;font-family:${FONT};font-size:13px;font-weight:700;">0${i + 1}</td></tr></table>` +
        `</td><td valign="top" style="padding:0 0 18px 0;font-family:${FONT};">` +
        `<p class="dm-text" style="margin:0;font-size:16px;line-height:22px;font-weight:600;color:${C.ink};">${escapeHtml(s.title)}</p>` +
        `<p class="dm-muted" style="margin:4px 0 0 0;font-size:14px;line-height:21px;color:${C.slate};">${escapeHtml(s.body)}</p>` +
        `</td></tr>`
      );
    })
    .join("\n");
}

function socialHtml(socials, siteUrl) {
  return socials
    .map(
      (s) =>
        `<td style="padding:0 6px;"><a href="${escapeHtml(s.url)}" target="_blank" style="text-decoration:none;"><img src="${escapeHtml(`${siteUrl}/email/icon_${s.platform}.jpg`)}" width="28" height="28" alt="${escapeHtml(`Adbyrd on ${s.label}`)}" style="display:block;width:28px;height:28px;border:0;border-radius:4px;"></a></td>`,
    )
    .join("");
}

function legalHtml(links, siteUrl) {
  return links
    .map(
      (l) =>
        `<a href="${escapeHtml(siteUrl + l.path)}" target="_blank" class="dm-muted" style="color:${C.slate};text-decoration:underline;">${escapeHtml(l.label)}</a>`,
    )
    .join(` <span style="color:${C.mist};">&middot;</span> `);
}

function touchRows(t) {
  if (!t) return [["Touch", "—"]];
  return [
    ["Source / medium", `${t.source || "—"} / ${t.medium || "—"}`],
    ["Campaign", t.campaign || "—"],
    ["Landing page", t.landing_page || "—"],
    ["Referrer", t.referrer || "—"],
    ["Click ID type", t.click_id_type || "—"],
  ];
}

function attributionHtml(attribution) {
  const col = (title, t) =>
    `<td class="stack" valign="top" width="50%" style="padding:0 8px 16px 0;">` +
    `<p class="dm-muted" style="margin:0 0 6px 0;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.steel};">${escapeHtml(title)}</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">` +
    touchRows(t)
      .map(
        ([k, v]) =>
          `<tr><td class="dm-muted" style="padding:3px 0;font-family:${FONT};font-size:12px;line-height:17px;color:${C.slate};width:96px;" valign="top">${escapeHtml(k)}</td><td class="dm-text" style="padding:3px 0;font-family:${FONT};font-size:13px;line-height:17px;color:${C.ink};word-break:break-all;" valign="top">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table></td>`;
  return `<tr>${col("First touch", attribution?.first)}${col("Last touch", attribution?.last)}</tr>`;
}

function attributionText(attribution) {
  const block = (title, t) => `${title}\n` + touchRows(t).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return `${block("First touch", attribution?.first)}\n${block("Last touch", attribution?.last)}`;
}

function crmBanner(crm, portalId) {
  if (crm?.contactOk && crm.contactId) {
    const url = hubspotContactUrl(portalId, crm.contactId);
    const noteWarn = crm.noteOk === false ? " (the inquiry note couldn't be logged; it's all below)" : "";
    return {
      html:
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="dm-card2 dm-text" style="padding:14px 18px;background-color:#eef3f3;border:1px solid ${C.mist};border-radius:8px;font-family:${FONT};font-size:14px;line-height:20px;color:${C.ink};">` +
        `<strong>${crm.created ? "New contact" : "Existing contact"} synced to HubSpot.</strong>${escapeHtml(noteWarn)} ` +
        `<a href="${escapeHtml(url)}" target="_blank" class="dm-muted" style="color:${C.steel};font-weight:600;text-decoration:underline;">Open contact record&nbsp;&rarr;</a>` +
        `</td></tr></table>`,
      text: `HubSpot: ${crm.created ? "new" : "existing"} contact synced${noteWarn}. ${url}`,
    };
  }
  return {
    html:
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:14px 18px;background-color:#fbece3;border:1px solid ${C.ember2};border-radius:8px;font-family:${FONT};font-size:14px;line-height:20px;color:${C.ink};">` +
      `<strong>&#9888; CRM sync failed.</strong> This contact was not saved to HubSpot. Add it by hand from the details below.` +
      `</td></tr></table>`,
    text: "⚠ CRM sync failed. This contact was not saved to HubSpot. Add it by hand from the details below.",
  };
}

/**
 * Renders both emails and the Resend request bodies.
 * @param {object} args
 * @param {object} args.payload    validated inquiry from the site (see project/app/api/inquiry/route.ts)
 * @param {object} args.config     values from the workflow's Config node
 * @param {object} args.site       contact, nextSteps, socials, legal (from project/lib, inlined at build time)
 * @param {object} args.templates  { ackHtml, ackText, notifyHtml, notifyText }
 * @param {object} [args.crm]      { contactOk, contactId, created, noteOk }
 */
export function renderInquiryEmails({ payload, config, site, templates, crm }) {
  const siteUrl = String(config.SITE_URL || "https://adbyrd.com").replace(/\/$/, "");
  const { first: firstName } = splitName(payload.name);
  const when = formatWhen(payload.submittedAt, config.TIMEZONE || "America/Detroit");
  const year = String(new Date(payload.submittedAt || Date.now()).getFullYear());
  const company = oneLine(payload.company) || "—";
  const optIn = payload.marketingOptIn === true ? "Yes" : "No";

  const common = {
    siteUrl,
    logoUrl: `${siteUrl}/email/icon_w_text.jpg`,
    year,
    phoneDisplay: site.contact.phoneDisplay,
    phoneHref: `tel:${site.contact.phoneE164}`,
    supportEmail: site.contact.email,
    supportEmailHref: `mailto:${site.contact.email}`,
    addressOneLine: site.contact.addressOneLine,
    submissionId: payload.submissionId,
  };

  /* ----- acknowledgment (to the submitter) ----- */
  const recap = [
    ["Service", payload.help],
    ["Budget", payload.budget],
    ["Stage", payload.stage],
  ];
  const ackSubject = oneLine(`We got your project inquiry, ${firstName}`);
  const ackVars = {
    ...common,
    preheader: "Thanks for reaching out. Here's a copy of what you sent and what happens next.",
    firstName,
    recapHtml: kvRowsHtml(recap.map(([k, v]) => [k, escapeHtml(v)])),
    recapText: kvRowsText(recap),
    projectHtml: nl2br(payload.project),
    projectText: String(payload.project ?? ""),
    nextStepsHtml: nextStepsHtml(site.nextSteps),
    nextStepsText: site.nextSteps.map((s, i) => `0${i + 1}  ${s.title}\n    ${s.body}`).join("\n"),
    socialHtml: socialHtml(site.socials, siteUrl),
    socialText: site.socials.map((s) => `${s.label}: ${s.url}`).join("\n"),
    legalHtml: legalHtml(site.legal, siteUrl),
    legalText: site.legal.map((l) => `${l.label}: ${siteUrl}${l.path}`).join("\n"),
  };

  /* ----- notification (to support) ----- */
  const banner = crmBanner(crm, config.HUBSPOT_PORTAL_ID);
  const emailHref = `mailto:${encodeURI(payload.email)}?subject=${encodeURIComponent("Re: Your Adbyrd project inquiry")}`;
  const fields = [
    ["Name", oneLine(payload.name)],
    ["Business", company],
    ["Email", payload.email],
    ["Service", payload.help],
    ["Budget", payload.budget],
    ["Stage", payload.stage],
    ["Marketing opt-in", optIn],
  ];
  const meta = [
    ["Submission ID", payload.submissionId],
    ["Submitted", when],
    ["Page", payload.pageUrl || "—"],
    ["Source", payload.source || "—"],
    ["User agent", payload.userAgent || "—"],
  ];
  const notifySubject = oneLine(`New inquiry: ${oneLine(payload.name, 80)} · ${payload.help} · ${payload.budget}`, 250);
  const notifyVars = {
    ...common,
    preheader: `${oneLine(payload.name, 80)} (${company}) · ${payload.help} · ${payload.budget}`,
    name: oneLine(payload.name),
    email: payload.email,
    emailHref,
    crmBannerHtml: banner.html,
    crmText: banner.text,
    fieldsHtml: kvRowsHtml(
      fields.map(([k, v]) => [
        k,
        k === "Email"
          ? `<a href="${escapeHtml(emailHref)}" style="color:${C.steel};font-weight:600;text-decoration:underline;">${escapeHtml(v)}</a>`
          : escapeHtml(v),
      ]),
    ),
    fieldsText: kvRowsText(fields),
    projectHtml: nl2br(payload.project),
    projectText: String(payload.project ?? ""),
    attributionHtml: attributionHtml(payload.attribution),
    attributionText: attributionText(payload.attribution),
    metaHtml: kvRowsHtml(meta.map(([k, v]) => [k, escapeHtml(v)])),
    metaText: kvRowsText(meta),
  };

  const ack = {
    subject: ackSubject,
    html: fill(templates.ackHtml, ackVars),
    text: fill(templates.ackText, ackVars, { html: false }),
  };
  const notify = {
    subject: notifySubject,
    html: fill(templates.notifyHtml, notifyVars),
    text: fill(templates.notifyText, notifyVars, { html: false }),
  };

  const supportTo = String(config.SUPPORT_NOTIFY_TO || site.contact.email)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    ack: {
      ...ack,
      idempotencyKey: `inquiry-ack/${payload.submissionId}`,
      body: {
        from: config.MAIL_FROM_ACK,
        to: [payload.email],
        reply_to: config.REPLY_TO_ACK || site.contact.email,
        subject: ack.subject,
        html: ack.html,
        text: ack.text,
        tags: [{ name: "type", value: "inquiry_ack" }],
      },
    },
    notify: {
      ...notify,
      idempotencyKey: `inquiry-notify/${payload.submissionId}`,
      body: {
        from: config.MAIL_FROM_NOTIFY,
        to: supportTo,
        reply_to: payload.email,
        subject: notify.subject,
        html: notify.html,
        text: notify.text,
        tags: [{ name: "type", value: "inquiry_notify" }],
      },
    },
  };
}
