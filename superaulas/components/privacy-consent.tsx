"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/campaign";
export function PrivacyConsent() {
  const [choice, setChoice] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("woa-marketing-v1");
      setChoice(
        saved === "accepted"
          ? "accepted"
          : saved === "rejected"
            ? "rejected"
            : null,
      );
      setOpen(!saved);
    } catch {
      setOpen(true);
    }
  }, []);
  function choose(value: string) {
    try {
      localStorage.setItem("woa-marketing-v1", value);
    } catch {}
    const revoke = choice === "accepted" && value !== "accepted";
    setChoice(value);
    setOpen(false);
    if (revoke) {
      (window as Window & { fbq?: (...args: string[]) => void }).fbq?.(
        "consent",
        "revoke",
      );
      window.location.reload();
    }
  }
  return (
    <>
      <button className="privacy-settings" onClick={() => setOpen(true)}>
        Preferências de privacidade
      </button>
      {open && (
        <section
          className="consent-panel"
          aria-label="Preferências de privacidade"
        >
          <p>
            Podemos usar o Pixel da Meta para medir visitas e campanhas, somente
            com sua autorização. Você pode recusar e continuar usando a página.
          </p>
          <a href={assetPath("/privacidade")}>Ler política de privacidade</a>
          <div>
            <button onClick={() => choose("rejected")}>
              Recusar marketing
            </button>
            <button onClick={() => choose("accepted")}>
              Aceitar marketing
            </button>
          </div>
        </section>
      )}
      {choice === "accepted" && (
        <Script
          id="woa-meta-pixel"
          strategy="afterInteractive"
        >{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','grant');fbq('init','2168410580211263');fbq('track','PageView');`}</Script>
      )}
    </>
  );
}
