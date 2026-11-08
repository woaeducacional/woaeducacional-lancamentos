import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/blacknovember/api/leads/route.ts";
const payload = {
  name: "Pessoa Teste",
  email: "teste@example.org",
  phone: "+5561999999999",
  campaignConsent: "on",
  website: "",
  utm: { utm_source: "teste" },
};
const req = (data) =>
  new Request("https://example.org/blacknovember/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.org",
    },
    body: JSON.stringify(data),
  });
test("validação e entrega do cadastro", async () => {
  assert.equal(
    (await POST(req({ ...payload, email: "inválido" }))).status,
    400,
  );
  assert.equal(
    (await POST(req({ ...payload, campaignConsent: "" }))).status,
    400,
  );
  delete process.env.SUPABASE_URL;
  assert.equal((await POST(req(payload))).status, 503);
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test_only";
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.NEXT_PUBLIC_PRIVACY_URL = "https://example.org/privacidade";
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL =
    "https://chat.whatsapp.com/example";
  const original = globalThis.fetch;
  try {
    for (const [status, code] of [
      [401, "LEADS_STORAGE_AUTH"],
      [403, "LEADS_STORAGE_PERMISSION"],
      [404, "LEADS_STORAGE_TABLE"],
      [400, "LEADS_STORAGE_SCHEMA"],
    ]) {
      globalThis.fetch = async () => Response.json(
        { code: "PROVIDER_TEST", message: "internal detail must not reach the client" },
        { status },
      );
      const response = await POST(req(payload));
      assert.equal(response.status, 502);
      assert.deepEqual(await response.json(), { error: "Falha no recebimento", code });
    }
    globalThis.fetch = async () => new Response(null, { status: 500 });
    assert.equal((await POST(req(payload))).status, 502);
    let sent;
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://project.supabase.co/rest/v1/black_november_leads");
      assert.equal(init.headers.apikey, "sb_secret_test_only");
      assert.equal(init.headers.Prefer, "return=minimal");
      sent = JSON.parse(init.body);
      return new Response(null, { status: 201 });
    };
    assert.equal((await POST(req(payload))).status, 200);
    assert.equal(sent.marketing_consent, false);
    assert.equal(sent.phone, "5561999999999");
    assert.equal(sent.utm.utm_source, "teste");
  } finally {
    globalThis.fetch = original;
  }
});

test("origens públicas atrás do proxy e bloqueio de sites externos", async () => {
  const keys = ["URL", "DEPLOY_URL", "DEPLOY_PRIME_URL", "VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL", "BLACK_NOVEMBER_ALLOWED_ORIGINS"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const internalUrl = "http://localhost:3000/blacknovember/api/leads";
  const probe = (origin, extraHeaders = {}) =>
    POST(new Request(internalUrl, {
      method: "POST",
      headers: { "content-type": "application/json", origin, ...extraHeaders },
      // Payload inválido: verifica a origem sem criar cadastro ou chamar o banco.
      body: "{}",
    }));
  try {
    for (const key of keys) delete process.env[key];
    assert.equal((await probe("http://localhost:3000")).status, 400);
    assert.equal(
      (await probe("https://friendly-marzipan-660191.netlify.app")).status, 400,
    );
    for (const origin of [
      "https://woa-black-november.netlify.app",
      "https://woa-black-november.vercel.app",
      "https://deploy-preview-2--woa-black-november.netlify.app",
      "https://deploy-preview-123--woa-black-november.netlify.app",
    ]) assert.equal((await probe(origin)).status, 400);
    process.env.VERCEL_URL = "campanha-teste-woatalk1.vercel.app";
    assert.equal((await probe("https://campanha-teste-woatalk1.vercel.app")).status, 400);
    process.env.BLACK_NOVEMBER_ALLOWED_ORIGINS = "https://woatalk.com.br, https://www.woatalk.com.br";
    assert.equal((await probe("https://woatalk.com.br")).status, 400);
    assert.equal((await probe("https://www.woatalk.com.br")).status, 400);
    process.env.URL = "https://campanha.example.org";
    process.env.DEPLOY_URL = "https://deploy-123--woa.netlify.app";
    process.env.DEPLOY_PRIME_URL = "https://preview--woa.netlify.app";
    for (const origin of [process.env.URL, process.env.DEPLOY_URL, process.env.DEPLOY_PRIME_URL])
      assert.equal((await probe(origin)).status, 400);
    for (const origin of [
      "https://woatalk.com",
      "https://www.woatalk.com",
      "https://external.example",
      "https://deploy-preview-2--outro-projeto.netlify.app",
      "https://deploy-preview-2--woa-black-november.netlify.app.external.example",
      "https://deploy-preview-2--woa-black-november.netlify.app/forjado",
      "http://deploy-preview-2--woa-black-november.netlify.app",
      "https://friendly-marzipan-660191.netlify.app.external.example",
      "null",
    ]) {
      assert.equal((await probe(origin, {
        "x-forwarded-host": "external.example",
        "x-forwarded-proto": "https",
      })).status, 403);
    }
    process.env.URL = "not-a-url";
    process.env.DEPLOY_URL = "javascript:alert(1)";
    delete process.env.DEPLOY_PRIME_URL;
    assert.equal((await probe("https://external.example")).status, 403);
    assert.equal((await probe("https://friendly-marzipan-660191.netlify.app")).status, 400);
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

