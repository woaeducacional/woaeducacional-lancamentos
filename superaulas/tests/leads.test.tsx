import { test } from "node:test";
import assert from "node:assert/strict";
import { readLeadConfig } from "../lib/leads/config";
import { validateLead } from "../lib/leads/validation";
import { handleLeadRequest } from "../lib/leads/handler";
import { LeadForm } from "../components/lead-form";
import { JSDOM } from "jsdom";
const config = {
  url: "https://test-project.supabase.co",
  key: "sb_publishable_test-only",
};
const lead = {
  name: "Pessoa Teste",
  email: "TESTE@example.com",
  phone: "+55 (61) 99999-0000",
  campaign_consent: true,
  website: "",
};
function request(data: unknown = lead, extra: Record<string, string> = {}) {
  return new Request("https://preview.example/api/leads", {
    method: "POST",
    headers: {
      Origin: "https://preview.example",
      "Content-Type": "application/json",
      ...extra,
    },
    body: JSON.stringify(data),
  });
}
test("configuração aceita chave pública, rejeita credenciais administrativas e pode ser pausada", () => {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: config.url,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.key,
  };
  assert.deepEqual(readLeadConfig(env), config);
  assert.equal(readLeadConfig({}), null);
  assert.equal(readLeadConfig({ ...env, LEAD_CAPTURE_ENABLED: "false" }), null);
  assert.equal(
    readLeadConfig({
      ...env,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_secret_do-not-use",
    }),
    null,
  );
  const jwt = (role: string) =>
    `header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`;
  assert.equal(
    readLeadConfig({
      ...env,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: jwt("service_role"),
    }),
    null,
  );
  assert.ok(
    readLeadConfig({
      ...env,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: jwt("anon"),
    }),
  );
  assert.equal(
    readLeadConfig({ ...env, NEXT_PUBLIC_SUPABASE_URL: "http://localhost" }),
    null,
  );
});
test("cadastro exige consentimento e valida dados, descartando campos extras", () => {
  assert.deepEqual(validateLead({ ...lead, id: "ignored", role: "admin" }), {
    name: "Pessoa Teste",
    email: "teste@example.com",
    phone: "5561999990000",
    campaign_consent: true,
  });
  for (const patch of [
    { campaign_consent: false },
    { campaign_consent: "true" },
    { email: "invalid" },
    { phone: "abc123" },
    { name: " " },
    { website: "spam" },
  ])
    assert.equal(validateLead({ ...lead, ...patch }), null);
});
test("endpoint insere somente quatro campos sem consultar ou modificar registros", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async (input, init) => {
    calls++;
    assert.equal(input, `${config.url}/rest/v1/black_november_leads`);
    assert.equal(init?.method, "POST");
    assert.deepEqual(JSON.parse(String(init?.body)), validateLead(lead));
    assert.equal(new Headers(init?.headers).get("prefer"), "return=minimal");
    assert.equal(new Headers(init?.headers).get("authorization"), null);
    assert.equal(new Headers(init?.headers).get("apikey"), config.key);
    return new Response(null, { status: 201 });
  };
  const result = await handleLeadRequest(request(), config, fetcher);
  assert.equal(result.status, 201);
  assert.equal(calls, 1);
  assert.match((await result.json()).message, /Cadastro recebido/);
});
test("dados inválidos, origem externa, payload grande e configuração ausente não acessam banco", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async () => {
    calls++;
    throw Error("unexpected");
  };
  assert.equal((await handleLeadRequest(request(), null, fetcher)).status, 503);
  assert.equal(
    (
      await handleLeadRequest(
        request({ ...lead, campaign_consent: false }),
        config,
        fetcher,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handleLeadRequest(
        request(lead, { Origin: "https://other.example" }),
        config,
        fetcher,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleLeadRequest(
        request(lead, { "Content-Type": "text/plain" }),
        config,
        fetcher,
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await handleLeadRequest(
        request({ ...lead, name: "a".repeat(9000) }),
        config,
        fetcher,
      )
    ).status,
    413,
  );
  assert.equal(calls, 0);
});
test("RLS negado e falha de rede não expõem dados internos nem dão falso sucesso", async () => {
  for (const fetcher of [
    async () => new Response("private-database-error", { status: 403 }),
    async () => {
      throw Error("secret network detail");
    },
  ]) {
    const result = await handleLeadRequest(request(), config, fetcher);
    assert.equal(result.status, 503);
    assert.doesNotMatch(
      await result.text(),
      /private-database|secret network|sb_publishable/,
    );
  }
});
test("formulário envia consentimento explícito, trata erro e confirma somente após resposta", async () => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost",
  });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const originalFormData = globalThis.FormData;
  globalThis.FormData = dom.window.FormData as typeof FormData;
  const originalFetch = globalThis.fetch;
  const { render, fireEvent, waitFor, cleanup } =
    await import("@testing-library/react");
  let fail = true;
  let calls = 0;
  globalThis.fetch = async (input, init) => {
    calls++;
    assert.equal(input, `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/leads`);
    assert.equal(JSON.parse(String(init?.body)).campaign_consent, true);
    return Response.json(
      { message: fail ? "Falha" : "Cadastro recebido!" },
      { status: fail ? 503 : 201 },
    );
  };
  try {
    const view = render(<LeadForm available />);
    const consent = view.getByRole("checkbox") as HTMLInputElement;
    assert.equal(consent.checked, false);
    assert.equal(consent.required, true);
    fireEvent.change(view.getByLabelText("Nome"), {
      target: { value: "Pessoa Teste" },
    });
    fireEvent.change(view.getByLabelText("E-mail"), {
      target: { value: "teste@example.com" },
    });
    fireEvent.change(view.getByLabelText("WhatsApp com código do país"), {
      target: { value: "5561999990000" },
    });
    fireEvent.click(consent);
    fireEvent.submit(view.container.querySelector("form")!);
    await waitFor(() =>
      assert.match(view.getByRole("status").textContent!, /Não foi possível/),
    );
    fail = false;
    fireEvent.submit(view.container.querySelector("form")!);
    await waitFor(() =>
      assert.equal(view.getByRole("status").textContent, "Cadastro recebido!"),
    );
    assert.equal(calls, 2);
    assert.equal(
      (view.container.querySelector("fieldset") as HTMLFieldSetElement)
        .disabled,
      true,
    );
  } finally {
    cleanup();
    globalThis.fetch = originalFetch;
    globalThis.FormData = originalFormData;
    dom.window.close();
    for (const key of [
      "window",
      "document",
      "HTMLElement",
      "IS_REACT_ACT_ENVIRONMENT",
    ])
      Reflect.deleteProperty(globalThis, key);
  }
});
