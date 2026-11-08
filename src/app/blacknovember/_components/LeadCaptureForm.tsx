"use client";
import { getCampaignUtm } from "../_content/campaign-attribution.mjs";
import { trackSavedLead } from "../_content/meta-pixel.mjs";
import { useRef, useState } from "react";
export default function LeadCaptureForm({
  enabled,
  privacy,
}: {
  enabled: boolean;
  privacy: string;
}) {
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setError("");
    setBusy(true);
    const data = new FormData(e.currentTarget);
    const utm = getCampaignUtm();
    try {
      const r = await fetch("/blacknovember/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), utm }),
      });
      if (!r.ok || (await r.json()).ok !== true)
        throw Error(
          "Não foi possível concluir seu cadastro. Confira os dados e tente novamente.",
        );
      await trackSavedLead();
      location.assign("/blacknovember/confirmacao");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tente novamente.");
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} id="inscricao" className="form">
      <p className="form-intro">
        <strong>Cadastre-se gratuitamente</strong> e receba os detalhes da
        experiência.
      </p>
      <label>
        Nome completo
        <input
          required
          name="name"
          placeholder="Seu nome completo"
          autoComplete="name"
          minLength={3}
          maxLength={120}
        />
      </label>
      <label>
        Seu melhor e-mail
        <input
          required
          name="email"
          placeholder="Seu melhor e-mail"
          type="email"
          autoComplete="email"
          maxLength={254}
        />
      </label>
      <label>
        WhatsApp com código do país e DDD
        <input
          required
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+55 (61) 99999-9999"
          minLength={10}
          maxLength={25}
        />
      </label>
      <div className="trap" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="check">
        <input required type="checkbox" name="campaignConsent" />{" "}
        <span>
          Quero receber as orientações desta campanha e li a{" "}
          {privacy ? (
            <a href={privacy} target="_blank" rel="noreferrer">
              Política de Privacidade
            </a>
          ) : (
            "Política de Privacidade (em configuração)"
          )}
          .
        </span>
      </label>
      <label className="check">
        <input type="checkbox" name="marketingConsent" />
        <span>
          Também quero receber outras ofertas da WOA. Posso cancelar esse
          recebimento.
        </span>
      </label>
      <button disabled={!enabled || busy}>
        {busy ? "Enviando…" : "Quero meus 30 dias grátis →"}
      </button>
      {!enabled && (
        <small role="status">
          Inscrições em preparação. Aguarde a abertura oficial.
        </small>
      )}
      <p role="alert" className="error">
        {error}
      </p>
      <small>Sem obrigação de contratar um plano pago.</small>
    </form>
  );
}

