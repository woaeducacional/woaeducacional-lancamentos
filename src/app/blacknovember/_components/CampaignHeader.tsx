export default function CampaignHeader() {
  return (
    <header className="campaign-header">
      <a href="#oferta" aria-label="WOA Talk — início">
        <img
          src="/blacknovember/images/logo-woa-transparent.png"
          width="447"
          height="559"
          alt="WOA Talk"
        />
      </a>
      <div className="campaign-lockup">
        <b>
          BLACK <mark>NOVEMBER</mark>
        </b>
        <span>WOA TALK / 2026</span>
      </div>
      <a className="header-cta" href="#inscricao">
        Inscrição gratuita ↗
      </a>
    </header>
  );
}

