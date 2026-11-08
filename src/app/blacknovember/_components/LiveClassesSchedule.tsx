import { campaign as c } from "../_content/black-november";
export default function LiveClassesSchedule() {
  return (
    <section className="schedule-section">
      <div className="wrap">
        <div className="section-heading">
          <p className="eyebrow">AGENDA PREVISTA / NOVEMBRO DE 2026</p>
          <h2>
            4 ENCONTROS.
            <br />
            <mark>UMA NOVA ATITUDE.</mark>
          </h2>
        </div>
        <div className="calendar">
          {c.classes.map(([date, t], i) => (
            <article key={date}>
              <span className="lesson-label">AULA {i + 1}</span>
              <strong>{date}</strong>
              <h3>{t}</h3>
              <p>Horário previsto: 19h</p>
            </article>
          ))}
        </div>
        <p className="schedule-note">
          Calendário provisório. Datas, horários, fuso e links serão confirmados
          pela equipe.
        </p>
      </div>
    </section>
  );
}

