"use client";
import { useCampaignDate } from "@/lib/use-campaign-date";
import { Award, CalendarDays, ArrowUpRight } from "lucide-react";
import {
  lots,
  plans,
  integrations,
  currency,
  safeHttps,
  lotStatus,
  campaignDate,
} from "@/lib/campaign";
export function PricingTable({ initialDate }: { initialDate?: string } = {}) {
  const date = useCampaignDate(initialDate);
  return (
    <>
      <p className="pricing-note" id="pricing-note">
        Até 12x no cartão de crédito. Desconto especial à vista via Pix. Lotes
        conforme o horário de Brasília.
      </p>
      <div
        className="table-scroll"
        role="region"
        aria-label="Planos e lotes"
        tabIndex={0}
      >
        <table aria-describedby="pricing-note">
          <caption className="sr-only">
            Três planos de conversação e quatro lotes. Parcelamento em 12 vezes
            e valor à vista.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="plan-header">
                Seu próximo
                <br />
                nível começa aqui.
              </th>
              {lots.map((lot) => (
                <th scope="col" key={lot.id} className={`lot-${lot.id}`}>
                  <span className="lot-title">LOTE {lot.id}</span>
                  <span className="lot-date">
                    <CalendarDays size={15} aria-hidden="true" />
                    {lot.dates}
                  </span>
                  <small className="lot-status">{lotStatus(lot, date)}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <th scope="row" className="plan-name">
                  <div>
                    <span className={`medal ${plan.medal}`}>
                      <Award size={30} aria-hidden="true" />
                    </span>
                    <span>
                      <small>PLANO</small>
                      {plan.label}
                    </span>
                  </div>
                </th>
                {plan.prices.map((price, index) => {
                  const url = safeHttps(
                    integrations.checkout[`${plan.id}-lote-${index + 1}`],
                  );
                  const status = lotStatus(lots[index], date);
                  return (
                    <td key={index} className={`lot-${index + 1}`}>
                      <div className="price">
                        <span>Até 12x de</span>{" "}
                        <strong>{currency(price.installment)}</strong>
                      </div>
                      <div className="cash">
                        À vista via Pix: <b>{currency(price.cash)}</b>
                      </div>
                      {url && status === "Vigente" ? (
                        <a
                          className="payment-button"
                          href={url}
                          onClick={(event) => {
                            if (
                              lotStatus(
                                lots[index],
                                campaignDate(new Date()),
                              ) !== "Vigente"
                            )
                              event.preventDefault();
                          }}
                          aria-label={`Garantir vaga: ${plan.label}, lote ${index + 1}`}
                        >
                          Garantir minha vaga{" "}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      ) : (
                        <button
                          className="payment-button"
                          disabled
                          aria-label={`${status === "Vigente" ? "Pagamento indisponível" : status}: ${plan.label}, lote ${index + 1}`}
                        >
                          {status === "Vigente" ? "Indisponível" : status}{" "}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-hint">
        No celular, deslize a tabela para comparar os quatro lotes →
      </p>
      <p className="terms">
        Cada plano e lote possui seu botão de matrícula. Para pagar com desconto
        via Pix, use a seção abaixo e informe exatamente o valor à vista do
        plano escolhido e lote vigente.
      </p>
    </>
  );
}
