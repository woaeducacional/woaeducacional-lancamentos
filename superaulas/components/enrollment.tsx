"use client";
import { MessageCircle, QrCode, ArrowUpRight } from "lucide-react";
import {
  integrations,
  whatsappUrl,
  safeHttps,
  currentLot,
  campaignDate,
} from "@/lib/campaign";
import { useCampaignDate } from "@/lib/use-campaign-date";
export function Enrollment({ initialDate }: { initialDate?: string } = {}) {
  const date = useCampaignDate(initialDate);
  const active = currentLot(date);
  const contact = whatsappUrl(integrations.whatsapp);
  const pix = safeHttps(integrations.pixUrl);
  return (
    <section className="enrollment" aria-labelledby="enrollment-title">
      <div>
        <span className="eyebrow">CONFIRMAÇÃO DA MATRÍCULA</span>
        <h2 id="enrollment-title">
          Confirme sua matrícula
          <br />
          <em>com desconto via Pix!</em>
        </h2>
        <p>
          No pagamento, informe exatamente o valor à vista do plano escolhido e
          lote vigente.
        </p>
      </div>
      <div className="enrollment-panel">
        <div className="panel-title">
          <QrCode aria-hidden="true" />
          <h3>Matrícula com desconto via Pix</h3>
        </div>
        <ol>
          <li>
            <span>01</span>Escolha seu plano e confira o lote vigente.
          </li>
          <li>
            <span>02</span>Informe no Asaas exatamente o valor à vista indicado
            na tabela.
          </li>
          <li>
            <span>03</span>Envie o comprovante pelo WhatsApp para confirmar sua
            matrícula e receber seus acessos.
          </li>
        </ol>
        {pix && active ? (
          <a
            className="button button-yellow pix-button"
            href={pix}
            onClick={(event) => {
              if (!currentLot(campaignDate(new Date()))) event.preventDefault();
            }}
          >
            Confirmar matrícula com desconto via Pix
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ) : (
          <>
            <button className="button button-yellow pix-button" disabled>
              Confirmar matrícula com desconto via Pix
            </button>
            <p className="pending">
              {date
                ? "Matrículas via Pix indisponíveis fora do período da campanha."
                : "Verificando o lote vigente…"}
            </p>
          </>
        )}
        {active && (
          <p className="active-lot">
            Lote {active.id} vigente · {active.dates}/2026
          </p>
        )}
        <div className="oliver-contact">
          <strong>OLIVER — CONTATO DIRETO</strong>
          <p>+55 (61) 8117-6884</p>
        </div>
        {contact ? (
          <a href={contact} className="button whatsapp-button">
            <MessageCircle size={19} aria-hidden="true" />
            Enviar comprovante / Falar com Oliver
          </a>
        ) : (
          <button className="button whatsapp-button" disabled>
            WhatsApp indisponível
          </button>
        )}
        <p className="confirmation-note">
          A matrícula será confirmada pela equipe após a verificação do
          pagamento. Dúvidas? Fale diretamente com Oliver!
        </p>
      </div>
    </section>
  );
}
