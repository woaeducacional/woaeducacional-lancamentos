import { PrivacyConsent } from "@/components/privacy-consent";
import type { Metadata } from "next";
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource/barlow/latin-800.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "WOA Exclusive | Black November 2026 — 4 Superaulas",
  description:
    "Quatro superaulas práticas em inglês. Conheça os planos de conversação WOA Exclusive e prepare-se para o seu próximo nível.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <PrivacyConsent />
      </body>
    </html>
  );
}
