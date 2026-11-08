import CTA from "./CTA";
import { campaign as c } from "../_content/black-november";
export default function BenefitsSection() {
  return (
    <section className="benefits section-light" id="beneficios">
      <div className="wrap">
        <div className="section-heading">
          <p className="eyebrow">SUA PRÓXIMA JORNADA COMEÇA AQUI</p>
          <h2>
            MENOS TEORIA.
            <br />
            <mark>MAIS CONVERSA.</mark>
          </h2>
          <p>
            Você já estudou inglês, mas ainda trava para falar?
            <br />
            Venha conhecer a experiência antes de escolher um plano.
          </p>
        </div>
        <article className="feature-panel ocean-panel">
          <div className="feature-copy">
            <span className="feature-label">01 / EXPLORE O APLICATIVO</span>
            <h3>
              UM MERGULHO
              <br />
              NO SEU INGLÊS.
            </h3>
            <p>
              Conheça as jornadas gamificadas do WOA Talk Starter e mantenha
              contato com o idioma na sua rotina.
            </p>
            <div className="big-number">
              30{" "}
              <span>
                DIAS
                <br />
                GRÁTIS
              </span>
            </div>
            <small>
              O período começa após a liberação do acesso pela equipe.
            </small>
          </div>
          <div className="feature-art">
            <img
              src="/blacknovember/images/woa-oceano.webp"
              alt="O universo Oceanos da WOA Talk, com vida marinha e uma cidade submersa"
              loading="lazy"
            />
            <span className="art-caption">EXPLORE / OCEANOS</span>
          </div>
        </article>
        <article className="feature-panel earth-panel">
          <div className="feature-copy">
            <span className="feature-label">02 / COLOQUE EM PRÁTICA</span>
            <h3>
              MAIS CONFIANÇA.
              <br />
              NOVOS HORIZONTES.
            </h3>
            <p>
              Quatro encontros especiais com prática guiada para você começar a
              falar inglês com mais naturalidade.
            </p>
            <div className="big-number">
              4{" "}
              <span>
                AULAS
                <br />
                AO VIVO
              </span>
            </div>
            <small>Acompanhe os links e orientações no grupo oficial.</small>
          </div>
          <div className="feature-art">
            <img
              src="/blacknovember/images/woa-terra.webp"
              alt="Uma águia voa sobre as montanhas e o vale do universo Terra da WOA"
              loading="lazy"
            />
            <span className="art-caption">VÁ ALÉM / TERRA</span>
          </div>
        </article>
        <div className="extras-heading">
          <h3>E TEM MAIS PARA CONHECER.</h3>
          <p>
            Explore o universo WOA conforme os recursos liberados na
            experiência.
          </p>
        </div>
        <div className="extras">
          {c.benefits.slice(2).map(([n, t, d]) => (
            <article key={n}>
              <span>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="center-cta">
          <CTA />
        </div>
      </div>
    </section>
  );
}

