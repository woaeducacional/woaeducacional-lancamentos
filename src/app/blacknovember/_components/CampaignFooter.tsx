import { getPrivacyUrl } from "../_content/privacy.mjs";
export default function CampaignFooter() {
  const privacy = getPrivacyUrl();
  return (
    <footer>
      <strong>WOA TALK — WOA EDUCACIONAL</strong>
      <p>Tecnologia, conteúdo e prática para sua jornada de aprendizagem.</p>
      <nav>
        {[
          [privacy, "Privacidade"],
          [process.env.NEXT_PUBLIC_TERMS_URL, "Termos de Uso"],
          [process.env.NEXT_PUBLIC_RULES_URL, "Regulamento"],
        ].map(([u, t]) =>
          u ? (
            <a key={t} href={u}>
              {t}
            </a>
          ) : null,
        )}
      </nav>
      <small>© 2026 WOA Educacional. Todos os direitos reservados.</small>
    </footer>
  );
}

