import { campaign as c } from "../_content/black-november";
export default function FAQSection() {
  return (
    <section className="faq-section section-light">
      <div className="wrap narrow">
        <div className="section-heading">
          <p className="eyebrow">TIRE SUAS DÚVIDAS</p>
          <h2>
            ANTES DE
            <br />
            <mark>EMBARCAR.</mark>
          </h2>
        </div>
        {c.faq.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

