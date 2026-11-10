
// Envio opcional Meta CAPI apos sucesso do Supabase; nunca executa no navegador.
// O token pertence somente ao servidor. Nao enviar dados de formulario ou URL com query.
import { isIP } from 'node:net';
import { PIXEL_ID } from '../_content/meta-pixel.mjs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CAMPAIGN_URL = 'https://woatalk.com.br/blacknovember';

export function buildSavedLeadEvent({ eventId, request, now = Date.now() }) {
  if (typeof eventId !== 'string' || !UUID.test(eventId)) return null;
  const userAgent = request.headers.get('user-agent')?.trim().slice(0, 512);
  if (!userAgent) return null;
  const user_data = { client_user_agent: userAgent };
  const forwarded = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim();
  if (ip && isIP(ip)) user_data.client_ip_address = ip;
  return {
    event_name: 'Lead', event_time: Math.floor(now / 1000), event_id: eventId,
    action_source: 'website', event_source_url: CAMPAIGN_URL, user_data,
  };
}

export async function sendSavedLeadToMeta({ request, eventId, adTrackingConsent, fetchImpl = fetch, env = process.env }) {
  // Sem aceite, habilitacao explicita, token, UUID ou navegador: nenhum envio.
  if (adTrackingConsent !== true || env.META_CAPI_ENABLED !== 'true' || !env.META_CAPI_ACCESS_TOKEN) return false;
  const event = buildSavedLeadEvent({ eventId, request });
  if (!event) return false;
  const version = env.META_CAPI_GRAPH_VERSION || 'v25.0';
  if (!/^v\d{1,2}\.\d{1,2}$/.test(version)) return false;
  const body = { data: [event] };
  if (/^[a-zA-Z0-9_-]{1,80}$/.test(env.META_CAPI_TEST_EVENT_CODE || '')) {
    body.test_event_code = env.META_CAPI_TEST_EVENT_CODE;
  }
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 1500);
  try {
    const response = await fetchImpl(`https://graph.facebook.com/${version}/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.META_CAPI_ACCESS_TOKEN}` },
      body: JSON.stringify(body), signal: abort.signal,
    });
    if (!response.ok) {
      console.warn('[blacknovember] Meta CAPI nao confirmou evento', { status: response.status });
      return false;
    }
    return true;
  } catch {
    console.warn('[blacknovember] Meta CAPI indisponivel');
    return false;
  } finally {
    clearTimeout(timer);
  }
}
