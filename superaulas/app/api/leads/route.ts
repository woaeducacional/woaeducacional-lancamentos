import { readLeadConfig } from "@/lib/leads/config";
import { handleLeadRequest } from "@/lib/leads/handler";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleLeadRequest(request, readLeadConfig(process.env));
}
