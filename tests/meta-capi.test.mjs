
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildSavedLeadEvent,
  sendSavedLeadToMeta,
} from "../src/app/blacknovember/_server/meta-capi.mjs";

const PIXEL_ID = "2168410580211263";

const EVENT_ID =
  "123e4567-e89b-42d3-a456-426614174000";

const ENV = {
  META_CAPI_ENABLED: "true",
  META_CAPI_ACCESS_TOKEN: "token-ficticio-de-teste",
  META_CAPI_GRAPH_VERSION: "v25.0",
  META_CAPI_TEST_EVENT_CODE: "TEST123",
};

function createRequest(headers = {}) {
  return new Request(
    "https://woatalk.com.br/blacknovember/api/leads",
    {
      method: "POST",
      headers: {
        "user-agent": "Mozilla/5.0 Test Browser",
        "x-forwarded-for": "203.0.113.10",
        ...headers,
      },
    }
  );
}

// TESTE 1
// Verifica a estrutura do evento Lead.
test("CAPI: cria evento Lead com ID correto", () => {
  const event = buildSavedLeadEvent({
    eventId: EVENT_ID,
    request: createRequest(),
    now: 1794254400000,
  });

  assert.ok(event);
  assert.equal(event.event_name, "Lead");
  assert.equal(event.event_id, EVENT_ID);
  assert.equal(event.action_source, "website");

  assert.equal(
    event.event_source_url,
    "https://woatalk.com.br/blacknovember"
  );
});

// TESTE 2
// Sem consentimento, nenhum evento pode ser enviado.
test("CAPI: bloqueia envio sem consentimento", async () => {
  let requests = 0;

  const fakeFetch = async () => {
    requests++;
    return Response.json({ events_received: 1 });
  };

  const result = await sendSavedLeadToMeta({
    request: createRequest(),
    eventId: EVENT_ID,
    adTrackingConsent: false,
    fetchImpl: fakeFetch,
    env: ENV,
  });

  assert.equal(result, false);
  assert.equal(requests, 0);
});

// TESTE 3
// Sem habilitacao na Vercel, nao envia.
test("CAPI: bloqueia quando desabilitada", async () => {
  let requests = 0;

  const result = await sendSavedLeadToMeta({
    request: createRequest(),
    eventId: EVENT_ID,
    adTrackingConsent: true,
    fetchImpl: async () => {
      requests++;
      return Response.json({ events_received: 1 });
    },
    env: {
      ...ENV,
      META_CAPI_ENABLED: "false",
    },
  });

  assert.equal(result, false);
  assert.equal(requests, 0);
});

// TESTE 4
// Sem token privado, nao envia.
test("CAPI: bloqueia envio sem token", async () => {
  let requests = 0;

  const result = await sendSavedLeadToMeta({
    request: createRequest(),
    eventId: EVENT_ID,
    adTrackingConsent: true,
    fetchImpl: async () => {
      requests++;
      return Response.json({ events_received: 1 });
    },
    env: {
      ...ENV,
      META_CAPI_ACCESS_TOKEN: "",
    },
  });

  assert.equal(result, false);
  assert.equal(requests, 0);
});

// TESTE 5
// IDs invalidos nao podem gerar eventos.
test("CAPI: rejeita eventId invalido", async () => {
  const result = await sendSavedLeadToMeta({
    request: createRequest(),
    eventId: "id-invalido",
    adTrackingConsent: true,
    fetchImpl: async () => {
      throw Error("Nao deveria executar");
    },
    env: ENV,
  });

  assert.equal(result, false);
});

// TESTE 6
// Confere Pixel, ID, evento e parametros enviados.
test("CAPI: envia Lead ao Pixel correto", async () => {
  let capturedURL;
  let capturedOptions;

  const fakeFetch = async (url, options) => {
    capturedURL = url;
    capturedOptions = options;

    return Response.json({
      events_received: 1,
    });
  };

  const result = await sendSavedLeadToMeta({
    request: createRequest(),
    eventId: EVENT_ID,
    adTrackingConsent: true,
    fetchImpl: fakeFetch,
    env: ENV,
  });

  assert.equal(result, true);

  assert.equal(
    capturedURL,
    `https://graph.facebook.com/v25.0/${PIXEL_ID}/events`
  );

  const body = JSON.parse(capturedOptions.body);

  assert.equal(body.data.length, 1);
  assert.equal(body.data[0].event_name, "Lead");
  assert.equal(body.data[0].event_id, EVENT_ID);
  assert.equal(body.test_event_code, "TEST123");

  assert.equal(
    capturedOptions.headers.Authorization,
    "Bearer token-ficticio-de-teste"
  );
});

// TESTE 7
// Nao enviar dados pessoais do formulario.
test("CAPI: nao inclui nome, email ou telefone", () => {
  const event = buildSavedLeadEvent({
    eventId: EVENT_ID,
    request: createRequest(),
  });

  const payload = JSON.stringify(event);

  assert.equal(
    Object.hasOwn(event.user_data, "em"),
    false
  );

  assert.equal(
    Object.hasOwn(event.user_data, "ph"),
    false
  );

  assert.equal(
    Object.hasOwn(event.user_data, "fn"),
    false
  );

  assert.equal(payload.includes("utm_source"), false);
  assert.equal(payload.includes("utm_campaign"), false);
});

// TESTE 8
// Falha da Meta nao deve impedir o cadastro.
test("CAPI: trata falha da Meta sem lancar erro", async () => {
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    const result = await sendSavedLeadToMeta({
      request: createRequest(),
      eventId: EVENT_ID,
      adTrackingConsent: true,
      fetchImpl: async () => {
        throw new Error("Falha simulada de rede");
      },
      env: ENV,
    });

    assert.equal(result, false);
  } finally {
    console.warn = originalWarn;
  }
});

// TESTE 9
// IP deve ser validado antes de ser utilizado.
test("CAPI: ignora endereco IP invalido", () => {
  const event = buildSavedLeadEvent({
    eventId: EVENT_ID,
    request: createRequest({
      "x-forwarded-for": "endereco-invalido",
    }),
  });

  assert.ok(event);
  assert.equal(
    Object.hasOwn(
      event.user_data,
      "client_ip_address"
    ),
    false
  );
});
