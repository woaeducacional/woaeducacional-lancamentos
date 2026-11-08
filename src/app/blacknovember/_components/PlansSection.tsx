import CTA from "./CTA";
export default function PlansSection() {
  return (
    <section className="next-level">
      <div className="wrap">
        <div className="next-grid">
          <div>
            <p className="eyebrow">DEPOIS DA EXPERIÊNCIA</p>
            <h2>
              O PRÓXIMO NÍVEL
              <br />
              <mark>É COM VOCÊ.</mark>
            </h2>
            <p>
              Experimente primeiro. Depois, conheça as opções para continuar
              praticando com a WOA Educacional.
            </p>
            <div className="plan-pills">
              <span>3 MESES</span>
              <span>6 MESES</span>
              <span>1 ANO</span>
            </div>
            <p className="fine-print">
              Valores, benefícios e condições serão apresentados pela equipe. A
              experiência gratuita não obriga você a contratar um plano.
            </p>
            <CTA />
          </div>
          <div className="galaxy-art">
            <img
              src="/blacknovember/images/woa-galaxias.webp"
              alt="Águia astronauta no universo Galáxias da WOA Talk"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

