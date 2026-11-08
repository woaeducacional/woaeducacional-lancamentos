import { getWhatsAppGroupUrl } from "../_content/whatsapp.mjs";
import CampaignFooter from "../_components/CampaignFooter";
export const metadata = {
  title: "Próximo passo | WOA Talk",
  robots: { index: false, follow: false },
};
export default function Confirmation() {
  const link = getWhatsAppGroupUrl();
  return (
    <>
      <main className="confirmation">
        <div className="wrap narrow">
          <img
            className="confirmation-logo"
            src="/blacknovember/images/logo-woa-transparent.png"
            alt="WOA Talk"
            width="64"
            height="80"
          />
          <p className="eyebrow">BLACK NOVEMBER WOA TALK</p>
          <h1>
            VOCÊ ESTÁ
            <br />
            <mark>QUASE LÁ!</mark>
          </h1>
          <p>
            Falta um passo para acompanhar a experiência.
            <br />
            Entre no <strong>grupo oficial do WhatsApp</strong> para receber as
            orientações e os avisos das aulas.
          </p>
          {link ? (
            <a
              className="button whatsapp"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Entrar no grupo oficial →
            </a>
          ) : (
            <p className="pending-message" role="status">
              O link do grupo será disponibilizado em breve.
            </p>
          )}
          <small>
            Após o cadastro, siga as orientações da equipe. Os 30 dias começam
            quando o Starter for liberado.
          </small>
        </div>
      </main>
      <CampaignFooter />
    </>
  );
}

