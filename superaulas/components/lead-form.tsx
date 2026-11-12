"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { assetPath } from "@/lib/campaign";
export function LeadForm({ available }: { available: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const feedback = useRef<HTMLParagraphElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || !available || state === "success") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    busy.current = true;
    setState("sending");
    setMessage("");
    try {
      const response = await fetch(assetPath("/api/leads"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          campaign_consent: data.get("campaign_consent") === "on",
          website: data.get("website"),
        }),
      });
      const result = await response.json();
      if (response.status !== 201) throw new Error("not-saved");
      setMessage(result.message);
      setState("success");
      form.reset();
    } catch {
      setMessage(
        "Não foi possível confirmar seu cadastro. Confira seus dados e tente novamente, ou fale com Oliver pelo WhatsApp abaixo.",
      );
      setState("error");
    } finally {
      busy.current = false;
      feedback.current?.focus();
    }
  }
  return (
    <section className="lead-section" aria-labelledby="lead-title">
      <div className="lead-intro">
        <span className="eyebrow">VAMOS CONVERSAR?</span>
        <h2 id="lead-title">
          Quer saber mais
          <br />
          <em>sobre as turmas?</em>
        </h2>
        <p>
          Deixe seus dados para receber informações da equipe WOA Talk sobre
          esta campanha.
        </p>
        <p className="lead-note">
          O cadastro é gratuito e não confirma matrícula.{" "}
          <a href={assetPath("/privacidade")}>Política de privacidade</a>
        </p>
      </div>
      <form
        className="lead-form"
        onSubmit={submit}
        aria-busy={state === "sending"}
      >
        <fieldset
          disabled={!available || state === "sending" || state === "success"}
        >
          <legend className="sr-only">Seus dados de contato</legend>
          <label htmlFor="lead-name">
            Nome
            <input
              id="lead-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
            />
          </label>
          <label htmlFor="lead-email">
            E-mail
            <input
              id="lead-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label htmlFor="lead-phone">
            WhatsApp com código do país
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              maxLength={40}
              aria-describedby="lead-phone-help"
              placeholder="+55 DDD número"
            />
          </label>
          <small id="lead-phone-help">Inclua o código do país e o DDD.</small>
          <div className="lead-honeypot" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="lead-consent">
            <input type="checkbox" name="campaign_consent" required />{" "}
            <span>
              Autorizo a WOA Talk a entrar em contato comigo por e-mail ou
              WhatsApp sobre esta campanha.
            </span>
          </label>
          <button type="submit" className="button button-yellow">
            {state === "sending" ? (
              <>
                <LoaderCircle size={18} aria-hidden="true" />
                Enviando…
              </>
            ) : state === "success" ? (
              <>
                <CheckCircle2 size={18} aria-hidden="true" />
                Cadastro recebido
              </>
            ) : (
              <>
                Quero receber informações
                <ArrowUpRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </fieldset>
        {!available && (
          <p className="lead-feedback">
            Cadastro temporariamente indisponível. Fale com Oliver pelo WhatsApp
            abaixo.
          </p>
        )}
        <p
          ref={feedback}
          className="lead-feedback"
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          {message}
        </p>
      </form>
    </section>
  );
}
