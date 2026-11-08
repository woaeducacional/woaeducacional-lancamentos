import { getPrivacyUrl } from "../_content/privacy.mjs";
import { getWhatsAppGroupUrl } from "../_content/whatsapp.mjs";
import LeadCaptureForm from "./LeadCaptureForm";
export default function BlackNovemberHero() {
  const privacy = getPrivacyUrl();
  const enabled = !!(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SECRET_KEY &&
    privacy &&
    getWhatsAppGroupUrl()
  );
  return (
    <section className="hero" id="oferta">
      <div className="hero-inner">
        <p className="eyebrow">BLACK NOVEMBER WOA TALK</p>
        <h1>
          <span>30 DIAS</span>
          <mark>GRÁTIS.</mark>
        </h1>
        <h2>
          DE WOA TALK STARTER
          <br />
          <span>+ 4 AULAS AO VIVO</span>
        </h2>
        <p className="hero-promise">Um mês para destravar sua conversação.</p>
        <p className="offer-note">
          Experimente o aplicativo e pratique inglês em quatro encontros
          especiais.
        </p>
        <div className="offer-stamps">
          <span>ACESSO GRATUITO</span>
          <span>CONVERSAÇÃO EM INGLÊS</span>
          <span>SEM CONTRATAÇÃO OBRIGATÓRIA</span>
        </div>
        <LeadCaptureForm enabled={enabled} privacy={privacy} />
        <div className="hero-signoff" aria-hidden="true">
          <span>MERGULHE.</span>
          <span>PRATIQUE.</span>
          <span>EVOLUA.</span>
        </div>
      </div>
    </section>
  );
}

