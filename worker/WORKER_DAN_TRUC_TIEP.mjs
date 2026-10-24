// CLOUDFLARE WORKER ĐỘC LẬP - HTB ĐA HỘI NGHỊ V5.0
// Hỗ trợ D1 Database (biến binding: DB) + CORS tự động cho GitHub Pages

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-HTB-Role",
  "Content-Type": "application/json; charset=utf-8"
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const confKey = url.searchParams.get("conf") || "doan";

    try {
      // 1. Healthcheck
      if (path === "/" || path === "/api/health") {
        return jsonResponse({
          ok: true,
          service: "htb-hoinghi-v5-api",
          version: "5.0.0",
          d1_connected: Boolean(env.DB),
          timestamp: new Date().toISOString()
        });
      }

      // 2. Điểm danh QR 1 chạm
      if (path === "/api/checkin" && request.method === "POST") {
        const body = await request.json();
        const code = String(body.code || "").trim().toUpperCase();
        const device = String(body.device || "Mobile").slice(0, 120);
        const timeStr = body.time || new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

        if (env.DB) {
          await env.DB.prepare(
            `UPDATE delegates SET present = 1, checkin_time = ?, device_fingerprint = ? WHERE conf_key = ? AND code = ?`
          ).bind(timeStr, device, confKey, code).run();
        }
        return jsonResponse({ ok: true, code, time: timeStr });
      }

      // 3. Nạp thêm Văn kiện Google Drive
      if (path === "/api/drive-docs" && request.method === "POST") {
        const doc = await request.json();
        if (env.DB) {
          await env.DB.prepare(
            `INSERT OR REPLACE INTO drive_documents (id, conf_key, doc_type, title, drive_url, summary, body, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            doc.id,
            confKey,
            doc.type || "PDF",
            doc.title,
            doc.driveUrl,
            doc.summary || "",
            doc.body || "",
            new Date().toISOString()
          ).run();
        }
        return jsonResponse({ ok: true, doc });
      }

      // 4. Bỏ phiếu bầu cử an toàn với D1 Batch
      if (path === "/api/ballot" && request.method === "POST") {
        const body = await request.json();
        const delegateCode = String(body.delegateCode || "HTB-001");
        const candidateIds = Array.isArray(body.candidateIds) ? body.candidateIds : [];
        const receiptHash = String(body.receiptHash || "HTB-SHA256");

        if (env.DB) {
          await env.DB.batch([
            env.DB.prepare(
              `INSERT INTO ballots (conf_key, delegate_code, candidate_ids_json, receipt_hash, created_at)
               VALUES (?, ?, ?, ?, ?)`
            ).bind(confKey, delegateCode, JSON.stringify(candidateIds), receiptHash, new Date().toISOString()),
            env.DB.prepare(
              `UPDATE delegates SET voted = 1, ballot_hash = ? WHERE conf_key = ? AND code = ?`
            ).bind(receiptHash, confKey, delegateCode)
          ]);
        }
        return jsonResponse({ ok: true, receiptHash });
      }

      // 5. Biểu quyết chỉ tiêu
      if (path === "/api/motion-vote" && request.method === "POST") {
        const body = await request.json();
        if (env.DB) {
          const recordId = `${confKey}_${body.motionId}_${body.delegateCode}`;
          await env.DB.prepare(
            `INSERT OR REPLACE INTO motion_votes (id, conf_key, motion_id, delegate_code, choice, note, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(recordId, confKey, body.motionId, body.delegateCode, body.choice, body.note || "", new Date().toISOString()).run();
        }
        return jsonResponse({ ok: true });
      }

      return jsonResponse({ ok: false, error: "Endpoint không tồn tại" }, 404);
    } catch (err) {
      return jsonResponse({ ok: false, error: String(err.message || err) }, 500);
    }
  }
};
