import { type LeadConfig } from "./config";
import { validateLead } from "./validation";
const unavailable =
  "Não foi possível enviar agora. Tente novamente mais tarde ou fale com Oliver.";
const reply = (status: number, message: string) =>
  Response.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
async function readSmallJson(request: Request) {
  if (Number(request.headers.get("content-length")) > 8192)
    throw new Error("too-large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid-json");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.length;
      if (size > 8192) {
        await reader.cancel();
        throw new Error("too-large");
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function handleLeadRequest(
  request: Request,
  config: LeadConfig | null,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (!config) return reply(503, unavailable);
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return reply(403, "Origem da solicitação não permitida.");
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return reply(415, "Envie os dados pelo formulário.");
  let input: unknown;
  try {
    input = await readSmallJson(request);
  } catch (error) {
    return reply(
      error instanceof Error && error.message === "too-large" ? 413 : 400,
      "Confira os dados informados.",
    );
  }
  const lead = validateLead(input);
  if (!lead)
    return reply(
      400,
      "Confira nome, e-mail, WhatsApp com código do país e autorização de contato.",
    );
  try {
    const response = await fetcher(
      `${config.url}/rest/v1/black_november_leads`,
      {
        method: "POST",
        headers: {
          apikey: config.key,
          ...(config.key.startsWith("sb_publishable_")
            ? {}
            : { Authorization: `Bearer ${config.key}` }),
          "Content-Type": "application/json",
          "Content-Profile": "public",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
        redirect: "error",
        cache: "no-store",
      },
    );
    // Nunca retornar mensagens internas, chaves ou dados de outros interessados.
    if (response.status !== 201 && response.status !== 204)
      return reply(503, unavailable);
    return reply(
      201,
      "Cadastro recebido! A equipe WOA Talk poderá entrar em contato sobre a campanha.",
    );
  } catch {
    return reply(503, unavailable);
  }
}
