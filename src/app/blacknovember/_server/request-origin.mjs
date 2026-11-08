// Endereços configurados pelo servidor, sem confiar em Host/X-Forwarded-Host enviados pelo cliente.
const campaignOrigin = "https://friendly-marzipan-660191.netlify.app";
const campaignHosts = [
  "https://woa-black-november.netlify.app",
  "https://woa-black-november.vercel.app",
];

export function isAllowedRequestOrigin(req) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  // Netlify pode não disponibilizar suas URLs no runtime da função.
  // Aceitar somente os previews deste projeto, sem liberar outros sites Netlify.
  if (/^https:\/\/deploy-preview-[0-9]+--woa-black-november\.netlify\.app$/.test(origin))
    return true;
  const candidates = [
    req.url,
    campaignOrigin,
    ...campaignHosts,
    process.env.URL,
    process.env.DEPLOY_URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    ...(process.env.BLACK_NOVEMBER_ALLOWED_ORIGINS || "").split(",").map(v => v.trim()),
  ];
  return candidates.some((value) => {
    if (!value) return false;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) && origin === url.origin;
    } catch {
      return false;
    }
  });
}

