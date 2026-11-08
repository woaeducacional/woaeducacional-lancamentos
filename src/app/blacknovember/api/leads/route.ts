import { isAllowedRequestOrigin } from "../../_server/request-origin.mjs";
import { getPrivacyUrl, PRIVACY_NOTICE_VERSION } from "../../_content/privacy.mjs";
import { getWhatsAppGroupUrl } from "../../_content/whatsapp.mjs";
export const runtime = "nodejs";
export async function POST(req: Request) {
  if (!isAllowedRequestOrigin(req))
    return Response.json({ error: "Origem inválida" }, { status: 403 });
  if (!req.headers.get("content-type")?.includes("application/json"))
    return new Response(null, { status: 415 });
  const text = await req.text();
  if (text.length > 5000) return new Response(null, { status: 413 });
  let d;
  try {
    d = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (
    !d ||
    typeof d !== "object" ||
    typeof d.name !== "string" ||
    d.name.trim().length < 3 ||
    d.name.length > 120 ||
    typeof d.email !== "string" ||
    d.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) ||
    typeof d.phone !== "string" ||
    !/^\d{10,15}$/.test(d.phone.replace(/\D/g, "")) ||
    d.campaignConsent !== "on" ||
    d.website
  )
    return Response.json({ error: "Dados inválidos" }, { status: 400 });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (
    !url ||
    !key ||
    !getPrivacyUrl() ||
    !getWhatsAppGroupUrl()
  )
    return Response.json(
      { error: "Inscrições em preparação" },
      { status: 503 },
    );
  const utm: Record<string, string> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ])
    if (typeof d.utm?.[key] === "string") utm[key] = d.utm[key].slice(0, 200);
  try {
    const r = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/black_november_leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: d.name.trim(),
          email: d.email.trim().toLowerCase(),
          phone: d.phone.replace(/\D/g, ""),
          campaign_consent: true,
          marketing_consent: d.marketingConsent === "on",
          notice_version: PRIVACY_NOTICE_VERSION,
          campaign: "black-november-2026",
          utm,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!r.ok) {
      // Categorias sem chaves, dados do cadastro ou mensagens internas do banco.
      const provider = await r.json().catch(() => ({}));
      const code = r.status === 401 ? "LEADS_STORAGE_AUTH"
        : r.status === 403 ? "LEADS_STORAGE_PERMISSION"
        : r.status === 404 ? "LEADS_STORAGE_TABLE"
        : r.status === 400 || r.status === 409 ? "LEADS_STORAGE_SCHEMA"
        : "LEADS_STORAGE_UNAVAILABLE";
      console.error("[blacknovember] delivery failed", {
        status: r.status,
        code: typeof provider.code === "string" ? provider.code.slice(0, 40) : code,
      });
      return Response.json({ error: "Falha no recebimento", code }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Falha no recebimento", code: "LEADS_STORAGE_CONNECTION" }, { status: 502 });
  }
}

