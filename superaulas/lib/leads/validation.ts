export type Lead = {
  name: string;
  email: string;
  phone: string;
  campaign_consent: true;
};
export function validateLead(input: unknown): Lead | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const row = input as Record<string, unknown>;
  if (
    typeof row.name !== "string" ||
    typeof row.email !== "string" ||
    typeof row.phone !== "string" ||
    row.campaign_consent !== true
  )
    return null;
  if (row.website !== undefined && row.website !== "") return null;
  const name = row.name.trim().replace(/\s+/g, " ");
  const email = row.email.trim().toLowerCase();
  if (
    name.length < 2 ||
    name.length > 120 ||
    /[\u0000-\u001f\u007f]/.test(name)
  )
    return null;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return null;
  if (row.phone.length > 40 || !/^[+\d\s().-]+$/.test(row.phone)) return null;
  const phone = row.phone.replace(/\D/g, "");
  if (!/^[1-9]\d{9,14}$/.test(phone)) return null;
  return { name, email, phone, campaign_consent: true };
}
