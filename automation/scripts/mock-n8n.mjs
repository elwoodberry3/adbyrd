#!/usr/bin/env node
/**
 * Local stand-in for the n8n webhook, for testing the form end to end.
 *
 *   N8N_WEBHOOK_SECRET=dev-secret node automation/scripts/mock-n8n.mjs
 *   # in project/.env.local:
 *   #   N8N_WEBHOOK_URL=http://localhost:5678/webhook/adbyrd-inquiry
 *   #   N8N_WEBHOOK_SECRET=dev-secret
 *
 * Checks X-Adbyrd-Signature like n8n's Header Auth (403 on mismatch), prints
 * the payload and answers 202 { ok, submissionId }.
 *
 * MOCK_MODE=fail  → 500 (the form shows its error panel)
 * MOCK_MODE=slow  → waits 10s (the site times out at 8s → 502)
 * PORT            → default 5678
 */
import http from "node:http";

const PORT = Number(process.env.PORT || 5678);
const SECRET = process.env.N8N_WEBHOOK_SECRET || "dev-secret";
const MODE = process.env.MOCK_MODE || "ok";
const PATH = "/webhook/adbyrd-inquiry";

const server = http.createServer((req, res) => {
  const send = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  };
  if (req.method !== "POST" || req.url !== PATH) return send(404, { message: "not found" });
  if (req.headers["x-adbyrd-signature"] !== SECRET) {
    console.log("✗ 403 bad or missing X-Adbyrd-Signature");
    return send(403, { message: "Authorization data is wrong!" });
  }

  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return send(400, { ok: false, error: "validation", fields: ["body"] });
    }
    console.log(`\n← ${new Date().toISOString()} inquiry ${payload.submissionId}`);
    console.log(JSON.stringify(payload, null, 2));

    if (MODE === "fail") {
      console.log("→ 500 (MOCK_MODE=fail)");
      return send(500, { message: "mock failure" });
    }
    const reply = () => {
      console.log("→ 202");
      send(202, { ok: true, submissionId: payload.submissionId });
    };
    if (MODE === "slow") setTimeout(reply, 10_000);
    else reply();
  });
});

server.listen(PORT, () => {
  console.log(`mock n8n listening on http://localhost:${PORT}${PATH} (mode: ${MODE})`);
});
