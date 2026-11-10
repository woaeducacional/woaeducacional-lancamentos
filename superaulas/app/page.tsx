import Image from "next/image";
import { LeadForm } from "@/components/lead-form";
import { readLeadConfig } from "@/lib/leads/config";
import { BrandLogo } from "@/components/brand-logo";
import {
  ArrowDown,
  ArrowUpRight,
  MessageSquare,
  Users,
  Smartphone,
  CirclePlay,
  Globe2,
  Sparkles,
  Orbit,
} from "lucide-react";
import { LessonCard } from "@/components/lesson-card";
import { SectionHeading } from "@/components/section-heading";
import { PricingTable } from "@/components/pricing-table";
import { Enrollment } from "@/components/enrollment";
import {
  lessons,
  benefits,
  languages,
  integrations,
  assetPath,
} from "@/lib/campaign";
const icons = [MessageSquare, Users, Smartphone, CirclePlay, Globe2];
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <>
      <header className="site-header campaign-header">
        <BrandLogo priority sizes="(max-width: 700px) 110px, 240px" />
        <div
          className="campaign-lockup"
          aria-label="Black November — WOA Talk 2026"
        >
          <p className="campaign-black">BLACK</p>
          <p className="campaign-november">NOVEMBER</p>
          <p className="campaign-year">WOA TALK / 2026</p>
        </div>
      </header>
      <main id="conteudo">
        <section
          className="hero campaign-hero"
          id="inicio"
          aria-labelledby="hero-title"
        >
          {integrations.assets.ocean && (
            <Image
              src={assetPath(integrations.assets.ocean)}
              alt=""
              fill
              priority
              sizes="100vw"
              className="artwork"
            />
          )}
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">BLACK NOVEMBER WOA TALK</span>
              <p className="exclusive">
                WOA <span>EXCLUSIVE</span>
              </p>
              <h1 id="hero-title">
                Desbloqueie sua
                <br />
                <em>conversação.</em>
              </h1>
              <p className="hero-description">
                <strong>
                  Mais de 15 anos de experiência no ensino de idiomas.
                </strong>
              </p>
              <div className="hero-actions">
                <a className="button button-yellow" href="#superaulas">
                  Explorar as superaulas{" "}
                  <ArrowDown size={18} aria-hidden="true" />
                </a>
                <a className="text-link" href="#planos">
                  Ver planos <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
              <div className="hero-meta">
                <span>
                  04 <small>SUPERAULAS</small>
                </span>
                <span>
                  05 <small>IDIOMAS PARA EXPLORAR</small>
                </span>
                <span>
                  01 <small>NOVO COMEÇO</small>
                </span>
              </div>
            </div>
            <div className="hero-art">
              {integrations.assets.galaxy && (
                <div className="galaxy-backdrop" aria-hidden="true">
                  <Image
                    src={assetPath(integrations.assets.galaxy)}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 90vw, (max-width: 959px) 400px, 500px"
                    className="galaxy-art"
                  />
                </div>
              )}
              {integrations.assets.eagle ? (
                <Image
                  src={assetPath(integrations.assets.eagle)}
                  alt="Águia astronauta WOA com aparência tridimensional diante de uma galáxia"
                  fill
                  priority
                  sizes="(max-width: 700px) 74vw, (max-width: 959px) 320px, (max-width: 1200px) 34vw, 420px"
                  className="eagle-art"
                />
              ) : (
                <div className="art-pending">
                  <Orbit size={100} strokeWidth={0.65} aria-hidden="true" />
                  <span>EXPLORE. CONVERSE. EVOLUA.</span>
                  <small>
                    Arte da águia astronauta aguardando arquivo original
                  </small>
                </div>
              )}
              <span className="art-caption">
                <Sparkles size={16} aria-hidden="true" /> SEU INGLÊS PODE IR
                ALÉM.
              </span>
            </div>
          </div>
          <a
            className="scroll-cue"
            href="#superaulas"
            aria-label="Ir para as quatro superaulas"
          >
            <ArrowDown size={18} />
          </a>
        </section>
        <div
          className="content-shell"
          style={{
            backgroundImage: `linear-gradient(to bottom, #031b30 55%, #031b3055), url("${assetPath("/images/ocean-floor.webp")}")`,
          }}
        >
          <section
            id="superaulas"
            className="lessons-section"
            aria-labelledby="lessons-title"
          >
            <SectionHeading
              id="lessons-title"
              description="Aulas especiais e práticas em inglês."
            >
              As 4 <em>superaulas</em>
            </SectionHeading>
            <div className="lessons-grid">
              {lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
            <p className="section-footnote">
              Os quatro PDFs já estão disponíveis. Assista à Aula 01; novos
              vídeos em breve.
            </p>
          </section>
          <section
            id="planos"
            className="plans-section"
            aria-labelledby="plans-title"
          >
            <SectionHeading
              id="plans-title"
              description="Escolha seu plano, matricule-se no lote vigente e garanta sua vaga!"
            >
              Planos de <em>conversação</em>
            </SectionHeading>
            <PricingTable />
          </section>
          <section
            className="benefits-section"
            aria-labelledby="benefits-title"
          >
            <span className="eyebrow" id="benefits-title">
              O QUE VOCÊ RECEBE
            </span>
            <ul className="benefits">
              {benefits.map((benefit, index) => {
                const Icon = icons[index];
                return (
                  <li key={benefit}>
                    <Icon size={30} strokeWidth={1.6} aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                );
              })}
            </ul>
            <section className="languages" aria-labelledby="languages-title">
              <div>
                <h3 id="languages-title">IDIOMAS DISPONÍVEIS</h3>
                <p>
                  Um mundo de possibilidades.
                  <br />
                  <strong>Qual idioma combina com você?</strong>
                </p>
              </div>
              <ul>
                {languages.map((language) => (
                  <li key={language.name}>
                    <Image
                      src={assetPath(language.flag)}
                      alt=""
                      width={28}
                      height={21}
                      className="language-flag"
                      unoptimized
                    />
                    {language.name}
                  </li>
                ))}
              </ul>
            </section>
          </section>
          <LeadForm available={Boolean(readLeadConfig(process.env))} />
          <Enrollment />
        </div>
      </main>
      <footer>
        <BrandLogo />
        <p>WOA Exclusive · Black November 2026</p>
        <span>WOA TALK — Sua jornada para destravar a conversação! <a href={assetPath("/privacidade")}>Política de Privacidade</a></span>
      </footer>
      <div className="review-banner">
        PRÉVIA PARA REVISÃO{" "}
        <span>
          Vídeos das aulas 02 a 04 em breve. Página ainda não publicada.
        </span>
      </div>
    </>
  );
}
