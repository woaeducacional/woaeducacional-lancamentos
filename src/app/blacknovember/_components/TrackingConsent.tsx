
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getCampaignAttribution } from "../_content/campaign-attribution.mjs";
import { CONSENT_KEY, getPixel } from "../_content/meta-pixel.mjs";
import styles from "./tracking-consent.module.css";

export default function TrackingConsent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const prepared = getCampaignAttribution()?.prepare();

    try {
      const choice = localStorage.getItem(CONSENT_KEY);
      setOpen(choice !== "granted" && choice !== "denied");
    } catch {
      setOpen(true);
    }

    if (prepared) {
      void getPixel()?.pageView().catch(() => {});
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === CONSENT_KEY || event.key === null) {
        getPixel()?.choose(
          event.newValue === "granted" ? "granted" : "denied"
        );
        setOpen(event.newValue === null);
      }
    }

    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("storage", sync);
    };
  }, []);

  function choose(value: "granted" | "denied") {
    getPixel()?.choose(value);
    setOpen(false);
  }

  return (
    <aside
      className={styles.panel}
      aria-label="Cookies de publicidade"
    >
      {open ? (
        <>
          <p>
            Podemos usar o Meta Pixel e a API de Conversões
            da Meta para medir visitas e cadastros e avaliar
            anúncios? Com sua autorização, a Meta poderá
            receber informações técnicas de navegação,
            endereço IP, navegador e identificadores de
            rastreamento, inclusive pelo servidor.
            Não enviamos nome, e-mail ou telefone do
            formulário à Meta. Recusar não impede
            seu cadastro.
          </p>

          <a href="/blacknovember/politica-de-privacidade">
            Política de Privacidade
          </a>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => choose("denied")}
            >
              Recusar publicidade
            </button>

            <button
              type="button"
              onClick={() => choose("granted")}
            >
              Aceitar publicidade
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
        >
          Cookies de publicidade
        </button>
      )}
    </aside>
  );
}
