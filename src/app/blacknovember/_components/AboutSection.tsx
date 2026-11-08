export default function AboutSection() {
  return (
    <section className="languages-section">
      <div className="wrap">
        <p className="eyebrow">CONHEÇA A WOA EDUCACIONAL</p>
        <h2>
          O MUNDO NÃO FALA
          <br />
          <mark>UMA LÍNGUA SÓ.</mark>
        </h2>
        <div className="language-pills">
          {["Inglês", "Francês", "Espanhol", "Italiano", "Russo"].map(
            (t, i) => (
              <span key={t}>
                <b>{["EN", "FR", "ES", "IT", "RU"][i]}</b>
                {t}
              </span>
            ),
          )}
        </div>
        <p>
          Conteúdo, tecnologia e prática para ir além das aulas tradicionais.
        </p>
        <small>
          Idiomas e recursos variam conforme o produto e o plano. As quatro
          aulas especiais desta campanha têm foco em inglês.
        </small>
      </div>
    </section>
  );
}

