import type { NextConfig } from "next";
export const SUPER_AULAS_BASE_PATH = "/BlackNovember/superaulas";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? SUPER_AULAS_BASE_PATH;
if (
  basePath &&
  (!basePath.startsWith("/") ||
    basePath.endsWith("/") ||
    !/^\/[A-Za-z0-9/_-]+$/.test(basePath))
) {
  throw new Error(
    "NEXT_PUBLIC_BASE_PATH deve começar com /, sem barra final ou caracteres especiais.",
  );
}
const config: NextConfig = { basePath, poweredByHeader: false };
export default config;
