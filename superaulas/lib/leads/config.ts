export type LeadConfig = { url: string; key: string };
export function readLeadConfig(
  env: Record<string, string | undefined>,
): LeadConfig | null {
  if (env.LEAD_CAPTURE_ENABLED === "false") return null;
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) return null;
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      !/^[a-z0-9-]+\.supabase\.co$/.test(parsed.hostname) ||
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash ||
      !["", "/"].includes(parsed.pathname)
    )
      return null;
    if (!key.startsWith("sb_publishable_")) {
      const payload = JSON.parse(
        Buffer.from(key.split(".")[1], "base64url").toString(),
      );
      if (payload.role !== "anon") return null;
    }
    return { url: parsed.origin, key };
  } catch {
    return null;
  }
}
