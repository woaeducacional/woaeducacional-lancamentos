import type { Metadata } from "next";

import CampaignHeader from "./_components/CampaignHeader";
import BlackNovemberHero from "./_components/BlackNovemberHero";
import BenefitsSection from "./_components/BenefitsSection";
import AboutSection from "./_components/AboutSection";
import HowItWorksSection from "./_components/HowItWorksSection";
import LiveClassesSchedule from "./_components/LiveClassesSchedule";
import PlansSection from "./_components/PlansSection";
import FAQSection from "./_components/FAQSection";
import FinalCTA from "./_components/FinalCTA";
import CampaignFooter from "./_components/CampaignFooter";

export const metadata: Metadata = {
  title: "Black November WOA Talk | 30 dias grátis",
  description:
    "Experimente o WOA Talk Starter por 30 dias e participe de quatro aulas especiais de conversação.",
  alternates: {
    canonical: "https://woatalk.com.br/blacknovember",
  },
};

export default function Page() {
  return (
    <main>
      <a className="skip" href="#oferta">
        Pular para o conteúdo
      </a>

      <CampaignHeader />
      <BlackNovemberHero />

      <div className="ribbon">
        30 DIAS DE STARTER <span>✦</span> 4 AULAS AO VIVO <span>✦</span> SUA
        JORNADA COMEÇA AQUI
      </div>

      <BenefitsSection />
      <AboutSection />
      <HowItWorksSection />
      <LiveClassesSchedule />
      <PlansSection />
      <FAQSection />
      <FinalCTA />
      <CampaignFooter />
    </main>
  );
}