import { campaign as c } from "../_content/black-november";
import CTA from "./CTA";
export default function HowItWorksSection() {
  return (
    <section className="how-section section-light">
      <div className="wrap narrow">
        <div className="section-heading">
          <p className="eyebrow">É SIMPLES PARTICIPAR</p>
          <h2>
            SEU PRIMEIRO PASSO
            <br />
            <mark>É GRATUITO.</mark>
          </h2>
          <p>Faça seu cadastro e acompanhe as orientações.</p>
        </div>
        <ol className="steps">
          {c.steps.map((text, i) => (
            <li key={text}>
              <span>{i + 1}º PASSO</span>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="center-cta">
          <CTA />
        </div>
      </div>
    </section>
  );
}

