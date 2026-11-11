# Inquiry pipeline: runbook

How a project inquiry on adbyrd.com/contact becomes a HubSpot contact plus two emails, and how to set it up, test it and keep it running.

```
Browser (components/InquiryForm.tsx)
  └─ POST /api/inquiry            Next.js Route Handler (Node runtime, server-only)
       • zod validation (lib/inquiry-schema.ts), honeypot + 3-second timer, optional Turnstile
       • in-memory rate limit: 5 per IP per 10 min, per instance
       • adds submittedAt, source, pageUrl, userAgent; the browser supplies submissionId
       • POST → n8n webhook with X-Adbyrd-Signature, 8s timeout
  └─ n8n "Adbyrd – Website Inquiry"
       Webhook (Header Auth) → Config → Validate → Respond 202
       → HubSpot: Find contact → Prepare contact → Update (PATCH) or Create (POST; a 409 falls back to PATCH)
       → HubSpot: Create note                          (all HubSpot steps continue on fail)
       → Render emails (templates + render.mjs, all user input escaped)
       → Resend: acknowledgment → Resend: support notification   (retry 429/5xx ×3, Idempotency-Key)
       → Finish
  └─ n8n "Adbyrd – Inquiry Error Alert"   (the main workflow's Error Workflow)
       emails support the failing node, the error, the execution link and the raw inquiry
```

The site makes exactly one server-side call. HubSpot and Resend are only ever called from n8n. The browser never sees the n8n URL, the secret or any API key.

## Files

| Path | What it is |
| --- | --- |
| `emails/inquiry-ack.html` / `.txt` | Acknowledgment to the person who sent the form |
| `emails/inquiry-notify.html` / `.txt` | Notification to the support inbox |
| `emails/render.mjs` | Fills the templates. **Single source of truth.** It's inlined into the n8n Code node. |
| `n8n/workflow-lib.mjs` | HubSpot field rules, payload validation, Resend retry policy. Inlined into the Code nodes. |
| `n8n/*.workflow.json` | **Generated** n8n exports. Don't edit them by hand. |
| `scripts/build-n8n-workflow.mjs` | Regenerates the exports from the files above and `project/lib/*` |
| `scripts/preview-emails.mjs` | Renders sample emails to `emails/preview/` (gitignored) |
| `scripts/mock-n8n.mjs` | Local stand-in for the webhook |
| `hubspot/create-properties.mjs` | Creates the HubSpot property group and properties (idempotent) |

Everything needs **Node.js 22.18 or newer**: the scripts import `project/lib/*.ts` directly, so the emails, workflow and HubSpot dropdowns always match the site's copy.

After changing a template, `render.mjs`, `workflow-lib.mjs`, or `inquiryOptions` / `nextSteps` / `socials` in `project/lib`:

```bash
node automation/scripts/build-n8n-workflow.mjs     # rewrite the exports
cd project && npm test                             # fails if an export is stale
```

Then re-import into n8n (see [Updating the workflow](#updating-the-workflow)).

---

## 1. Resend: domain and API key

1. **Resend → Domains → Add domain** → `adbyrd.com`. Resend lists the DNS records to add at your DNS host. Copy them exactly as shown; they're specific to your account:
   - **SPF**: a `TXT` record on the `send` subdomain (`v=spf1 include:amazonses.com ~all`) plus an `MX` record on the same subdomain for bounce handling. This doesn't touch the SPF on the root domain that your regular mailbox uses.
   - **DKIM**: a `TXT` record at `resend._domainkey`.
2. **DMARC** (recommended; add it at your DNS host if adbyrd.com doesn't have one yet):
   ```
   _dmarc.adbyrd.com  TXT  "v=DMARC1; p=none; rua=mailto:support@adbyrd.com; adkim=r; aspf=r"
   ```
   Start with `p=none` and watch the reports for 2–4 weeks. Once every legitimate sender (Resend, your mailbox provider, anything else) passes, move to `p=quarantine`, and later `p=reject`. If a DMARC record already exists, keep it and make sure it isn't stricter than your current senders can pass.
3. Wait until Resend shows the domain as **Verified**.
4. **Resend → API Keys → Create**: permission **Sending access**, domain **adbyrd.com** only. Copy the `re_…` key. You'll paste it into n8n and nowhere else.

The workflow sends as `Adbyrd <hello@adbyrd.com>` (acknowledgment) and `Adbyrd Website <notifications@adbyrd.com>` (support notification). Neither address needs a mailbox: replies to the acknowledgment go to `support@adbyrd.com` (reply-to), and replies to the notification go to the person who sent the inquiry.

## 2. HubSpot: private app and properties

1. **HubSpot → Settings → Integrations → Private Apps → Create a private app.** (Some accounts list these under *Legacy apps*.) Name it `Adbyrd n8n`.
2. **Scopes:**
   - `crm.objects.contacts.read`, `crm.objects.contacts.write`: search, create and update contacts, and log notes on them
   - `crm.schemas.contacts.read`, `crm.schemas.contacts.write`: used only by the properties script
3. Create the app and copy the access token (`pat-…`).
4. Create the properties (safe to re-run; `--dry-run` shows what would change):
   ```bash
   HUBSPOT_TOKEN=pat-… node automation/hubspot/create-properties.mjs --dry-run
   HUBSPOT_TOKEN=pat-… node automation/hubspot/create-properties.mjs
   ```
   This creates the **Adbyrd Website** group and `adbyrd_service_interest`, `adbyrd_budget_range`, `adbyrd_project_stage`, `adbyrd_project_description`, `adbyrd_first_touch_*`, `adbyrd_last_touch_*`, `adbyrd_landing_page`, `adbyrd_last_submission_id` and `adbyrd_marketing_opt_in`. The dropdown options come from `inquiryOptions` in `project/lib/content.ts`. Re-run the script after changing those options, and it syncs them.
5. Note your **portal ID** (the Hub ID in the account menu). It goes in the n8n Config node.

### What happens to a returning contact

The workflow searches by email first, then updates by ID or creates. All the rules live in `prepareContact()` in `n8n/workflow-lib.mjs`:

| Property | New contact | Existing contact |
| --- | --- | --- |
| `lifecyclestage` | `lead` | set to `lead` only if empty or `subscriber`, so it's never downgraded |
| `hs_lead_status` | `NEW` | set only if empty, so "In progress", "Connected" etc. are kept |
| `adbyrd_marketing_opt_in` | `true` if ticked | only ever written as `true`. An unticked box never clears an earlier yes. |
| `adbyrd_first_touch_*`, `adbyrd_landing_page` | set | set only if empty (first touch stays first) |
| `company`, `lastname` | set if given | updated if given; never blanked |
| service, budget, stage, `adbyrd_project_description`, `adbyrd_last_touch_*`, `adbyrd_last_submission_id` | set | **overwritten with the latest inquiry** |

`adbyrd_project_description` only holds the **most recent** message. That's on purpose: every inquiry is also logged as a **Note** on the contact ("Website inquiry <submissionId>", with the full message and attribution), so the history is on the timeline.

If HubSpot's search misses a contact that exists (its index can lag a few seconds), the create call returns 409. The workflow then updates that contact by ID and leaves the protected fields alone.

## 3. n8n: credentials, import and config

### Credentials (Credentials → Add credential). Use these exact names.

| Name | Type | Value |
| --- | --- | --- |
| `Adbyrd Webhook Header Auth` | **Header Auth** | Name `X-Adbyrd-Signature`; Value: a long random secret (`openssl rand -hex 32`). The same value goes in Vercel as `N8N_WEBHOOK_SECRET`. |
| `HubSpot – Adbyrd Private App (App Token)` | **HubSpot App Token** | the `pat-…` token |
| `Resend API (HTTP Bearer)` | **Bearer Auth** | the `re_…` key |

The exports reference credentials **by name only**, so no secret is in the repo. On import, n8n matches them by name. If a node shows a credential warning, open it and pick the credential from the list.

### Import (error workflow first)

1. **Workflows → Import from file → `n8n/adbyrd-inquiry-error.workflow.json`.** Open **Config** and check `SUPPORT_NOTIFY_TO` and `MAIL_FROM_NOTIFY`. Pick the Resend credential on **Resend: Send alert**. Save. (Error workflows run without being activated.)
2. **Import `n8n/adbyrd-website-inquiry.workflow.json`.**
3. Pick credentials on **Webhook**, the four **HubSpot:** nodes and the two **Resend:** nodes.
4. Open **Config** and fill in:

   | Key | Value |
   | --- | --- |
   | `HUBSPOT_PORTAL_ID` | your Hub ID (ships as `REPLACE_ME`) |
   | `SUPPORT_NOTIFY_TO` | `support@adbyrd.com`, or a comma-separated list |
   | `MAIL_FROM_ACK` | `Adbyrd <hello@adbyrd.com>` |
   | `MAIL_FROM_NOTIFY` | `Adbyrd Website <notifications@adbyrd.com>` |
   | `REPLY_TO_ACK` | `support@adbyrd.com` |
   | `SITE_URL` | `https://adbyrd.com` (email images load from `SITE_URL/email/…`) |
   | `TIMEZONE` | `America/Detroit` (Kalamazoo; used for "Submitted" in the support email) |

   **Guard:** if any Config value is empty or still contains `REPLACE_ME`, the **Validate** node stops the run before anything is sent. The site shows the visitor its error panel (retry, email, phone and copy-my-brief), and the Error Workflow emails support the raw inquiry. A half-configured import can't send mail from a bad address.
5. **Workflow settings → Error workflow → "Adbyrd – Inquiry Error Alert".** Workflow IDs are assigned on import, so the export can't set this for you. (To bake it in, rebuild with `ERROR_WORKFLOW_ID=<id> … --out-dir`, below.)
6. **Save and Activate.** The production URL is `https://<your-n8n-host>/webhook/adbyrd-inquiry`. That's `N8N_WEBHOOK_URL`.

**Execution data holds personal data.** The workflow saves every execution so failures can be replayed. Set execution pruning on the n8n instance (e.g. `EXECUTIONS_DATA_PRUNE=true`, `EXECUTIONS_DATA_MAX_AGE=720` hours = 30 days), and list that period in the privacy policy's retention section.

**Status codes:** n8n's Header Auth rejects a wrong secret with **403** before any node runs (the brief asked for 401; n8n doesn't allow changing it). A payload that fails validation gets **400**; a valid one gets **202 `{ ok, submissionId }`**. The site treats anything other than 2xx as a failure and shows its error panel.

### Updating the workflow

Importing creates a **new** workflow. To update one that's live:

1. Rebuild with your real config baked in, written outside the repo's committed files:
   ```bash
   HUBSPOT_PORTAL_ID=12345678 ERROR_WORKFLOW_ID=<id> \
     node automation/scripts/build-n8n-workflow.mjs --out-dir /tmp/adbyrd-n8n
   ```
2. Import `/tmp/adbyrd-n8n/adbyrd-website-inquiry.workflow.json`, pick the credentials, then deactivate the old workflow and activate the new one. Only one workflow can own the `adbyrd-inquiry` path.

If only a Code node changed, you can paste that node's new `jsCode` from the export instead.

### Retries and duplicates

- **Resend:** each send has an `Idempotency-Key` of `inquiry-ack/<submissionId>` or `inquiry-notify/<submissionId>`, and Resend dedupes on it for 24 hours. The **Check** nodes retry only 429, 5xx and network errors, three times (2s, 4s, 8s). A 4xx is never retried.
- **Browser retries:** the browser creates `submissionId` once per form fill and reuses it on retry. Say the first attempt reached n8n but the site gave up at 8 seconds and the person clicks *Try Again*. The emails carry the same keys, so Resend doesn't send them twice. (HubSpot gets the same update and a second identical Note.)
- **Ack failure:** if the acknowledgment fails permanently (e.g. a mistyped address that Resend rejects), the support notification still goes out. **Finish** then fails the run, so the Error Workflow tells support to reply by hand.
- **HubSpot failure:** never blocks the emails. The support email shows **⚠ CRM sync failed** instead of the contact link, with every field needed to add the contact by hand.

## 4. Vercel environment variables

**Project → Settings → Environment Variables** (Production):

| Variable | Value |
| --- | --- |
| `N8N_WEBHOOK_URL` | the production webhook URL from step 3.6 |
| `N8N_WEBHOOK_SECRET` | the same secret as the Header Auth credential |
| `TURNSTILE_SECRET_KEY` | *optional*: Cloudflare Turnstile secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | *optional*: Turnstile site key. Set both Turnstile values or neither. |

Neither secret may use the `NEXT_PUBLIC_` prefix. Redeploy after changing them; env vars are read at deploy time.

**Preview deployments:** don't give them the production webhook, or test submissions become real leads. Either leave the variables unset for Preview (the form then shows its error panel) or point Preview at a copy of the workflow that sends to a test inbox and uses a HubSpot sandbox.

**Turnstile:** if you enable it, add `https://challenges.cloudflare.com` to `script-src` and `frame-src` when the CSP in `next.config.mjs` is written. A failed check shows the visitor "Please complete the verification and try again". It never fakes success, because real people fail it sometimes.

## 5. End-to-end test checklist

Locally first:

- [ ] `cd project && npm test && npm run typecheck && npm run build`. In the build output, `/contact` is ○ (static) and `/api/inquiry` is ƒ.
- [ ] `npm run mock:n8n` in one terminal. In `.env.local` set `N8N_WEBHOOK_URL=http://localhost:5678/webhook/adbyrd-inquiry` and `N8N_WEBHOOK_SECRET=dev-secret`. Run `npm run dev` and submit the form. You should see the success panel, and the mock should print the payload (`submissionId`, attribution, no `website` / `elapsedMs`).
- [ ] `MOCK_MODE=fail npm run mock:n8n`: the error panel shows *Try Again*, email, phone and *Copy my brief*.
- [ ] Submit an empty form: inline errors appear, and the first invalid field gets focus.
- [ ] `npm run emails:preview`, then open `automation/emails/preview/index.html` and check 600px and 375px.

Against production (after steps 1–4):

- [ ] Submit with a **new** email address you control. The contact is created as Lead / NEW with the adbyrd_* fields and a Note. The acknowledgment arrives (check the inbox, not spam). The support email arrives with the HubSpot link, and *Reply* goes to the submitter.
- [ ] Submit again with the **same** email, after setting the contact's Lead status to *In progress* and ticking marketing opt-in on the first run but not the second. Lead status and opt-in are unchanged, there's a second Note, and the description shows the newer message.
- [ ] Temporarily break HubSpot (e.g. pick a wrong credential): the support email shows **⚠ CRM sync failed** and still arrives. Restore it afterwards.
- [ ] Temporarily set `HUBSPOT_PORTAL_ID` back to `REPLACE_ME`: the site shows its error panel and support gets the error alert with the raw payload. Restore it afterwards.
- [ ] Check rendering in Gmail (web + app, light and dark), Outlook desktop and Outlook.com, and Apple Mail (light and dark).
- [ ] GA4 DebugView / GTM Preview: `generate_lead` fires once, only after success, with `submission_id` and no name or email.
- [ ] Resend → Emails: both sends are tagged `type: inquiry_ack` / `inquiry_notify`.

## 6. Rotating the webhook secret

The Header Auth credential holds one value, so expect about a minute when old and new don't match. Do it at a quiet time; the form's error panel catches anyone affected.

1. Generate a new secret: `openssl rand -hex 32`.
2. In **Vercel**, update `N8N_WEBHOOK_SECRET` (Production) but don't redeploy yet.
3. In **n8n**, edit **Adbyrd Webhook Header Auth** → Value → the new secret → Save.
4. Right away, **redeploy** the production deployment in Vercel (Deployments → ⋯ → Redeploy).
5. Submit a test inquiry. If you see 502s, check that the two values match exactly (no trailing spaces).

Rotate immediately if the secret may have leaked. Also rotate the HubSpot token and Resend key from their dashboards if there's any doubt; only n8n holds those.

## Troubleshooting

| Symptom | Look at |
| --- | --- |
| Form shows the error panel, nothing in n8n | Vercel function logs for `/api/inquiry`: `{"evt":"inquiry","outcome":…}`. `not_configured` = missing env vars; `upstream_error` with status 403 = secret mismatch; `upstream_timeout` = n8n slow or down. |
| n8n run failed at **Validate** | Config node still has `REPLACE_ME`, or the payload failed validation (400). |
| Support email shows ⚠ CRM sync failed | Open the execution, then **HubSpot: Create/Update contact** output: token, scopes, or a missing property (re-run the properties script). |
| No acknowledgment arrived | Resend → Emails (bounced / suppressed?), and whether the domain is still verified. The Error Workflow alert names the status code. |

Logs contain only the `submissionId` and an outcome, never personal data. Use the `submissionId` to find the matching n8n execution, HubSpot Note and Resend emails.
