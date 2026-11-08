# WOA Talk — guia completo para copiar e colar

**Design V2:** abertura centralizada, oferta em primeiro plano, formulário compacto, benefícios com imagens e confirmação clara. A integração permanece com Supabase.

Este guia corresponde ao projeto entregue: Next.js, TypeScript e rota de API em Node.js. Cada título de arquivo abaixo vem acompanhado de todo o seu código. Crie o arquivo no caminho indicado e cole apenas o conteúdo do bloco de código. As imagens estão no ZIP; não precisam ser reconstruídas.

## 1. Plataformas e ferramentas

| Ferramenta | Uso | Necessidade |
|---|---|---|
| [VS Code](https://code.visualstudio.com/) | Criar e editar os arquivos | Necessária |
| [Node.js](https://nodejs.org/) — versão 24 LTS | Executar Next.js e os testes; inclui npm | Necessária no computador |
| [Git](https://git-scm.com/downloads) | Histórico local das alterações | Necessária |
| [GitHub](https://github.com/) | Cópia remota do código e colaboração | Conta necessária |
| Hospedagem atual da WOA | Publicar a rota no site existente | Preferência para manter o domínio atual |
| [Vercel](https://vercel.com/) | Alternativa para hospedar o projeto Next.js | Opcional se a hospedagem atual já atende |
| [Supabase](https://supabase.com/) | Banco de dados dos cadastros | Necessário nesta versão |
| WhatsApp | Grupo oficial e convite | Necessário para concluir o fluxo |

Next.js é o framework; Node.js é o ambiente de execução. Você não precisa instalar um servidor Express separado. Nesta versão, usamos o Supabase para os cadastros, sem n8n ou planilhas intermediárias. Serviços podem exigir planos pagos; confirme os planos da organização.

## 2. Abrir e executar no Windows

1. Instale Node.js e Git. Feche e abra novamente o VS Code.
2. Extraia o ZIP. Em **File > Open Folder**, selecione a pasta que contém `package.json`.
3. Abra **Terminal > New Terminal** (PowerShell).
4. Confira as instalações:

```powershell
node --version
npm --version
git --version
```

Instale as dependências e inicie:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Use `npm ci` se estiver usando o ZIP com package-lock.json. Se montar tudo manualmente pelos códigos abaixo, use `npm install` na primeira vez: isso cria o package-lock.json, que também deve ir para o Git. Nas próximas instalações, use `npm ci`.

Abra `http://localhost:3000/black-november`. A confirmação fica em `http://localhost:3000/black-november/confirmacao`. Para encerrar o servidor, pressione Ctrl+C no terminal.

Se o PowerShell bloquear `npm.ps1`, use `npm.cmd ci` e `npm.cmd run dev`, sem mudar a política global do Windows.

## 3. Imagens

No ZIP, os arquivos já estão em `public/images`:

- `oceanos.png`: fundo sem os textos, editado a partir da referência.
- `terra.png`: fundo sem os textos, editado a partir da referência.
- `galaxias.png`: fundo sem os textos, editado a partir da referência.
- `logo-woa.jpeg`: logo oficial enviado.

No código, `/images/oceanos.png` aponta para `public/images/oceanos.png`. Não escreva `/public/images/...` na URL. A edição por IA pode variar iluminação e pequenos detalhes em relação às capturas originais. O logo não foi redesenhado.

## 4. Ordem das seções e onde alterar

| Seção | Arquivo |
|---|---|
| Textos e listas editáveis | src/content/black-november.ts |
| Composição e ordem da página | src/app/black-november/page.tsx |
| Cabeçalho | CampaignHeader.tsx |
| Oferta / primeira dobra | BlackNovemberHero.tsx |
| Formulário | src/components/LeadCaptureForm.tsx |
| Benefícios | BenefitsSection.tsx |
| WOA / idiomas / Terra | AboutSection.tsx |
| Passo a passo | HowItWorksSection.tsx |
| Datas provisórias | LiveClassesSchedule.tsx |
| Continuidade / Galáxias | PlansSection.tsx |
| Perguntas | FAQSection.tsx |
| Chamada final | FinalCTA.tsx |
| Rodapé | CampaignFooter.tsx |
| Botão reutilizável | CTA.tsx |
| Confirmação | src/app/black-november/confirmacao/page.tsx |
| Recebimento dos leads | src/app/api/leads/route.ts |
| Cores, imagens de fundo, mobile | src/app/globals.css |

Os componentes da tabela sem caminho completo ficam em `src/components/black-november/`. Alterações de títulos e listas ficam no conteúdo; os parágrafos institucionais de algumas seções ficam no componente correspondente. O arquivo de composição define a ordem.

Prêmios e contador ainda não entram: dependem de benefícios e data confirmados. A integração atual do Pixel oficial usa consentimento separado de publicidade; os exemplos históricos abaixo não a incluem. Consulte o código atual e ENTREGA-OLIVER.md para validação e limites antes da publicação. As UTMs são gravadas no Supabase.

## 5. Configurar o Supabase



Os cadastros ficam no banco de dados Supabase. O GitHub guarda o código e a migração SQL. Conectar contas não copia registros do banco ao GitHub e não substitui backups.

### 1. Criar o projeto

Entre em https://supabase.com/dashboard, crie um projeto para a WOA e guarde a senha do banco em um gerenciador de senhas. Escolha a região adequada à operação. Não envie senha ou secret key no chat.

### 2. Criar a tabela

No painel do projeto correto, abra SQL Editor > New query, cole o SQL abaixo e execute uma vez. A migração também está em `supabase/migrations/202610300001_create_black_november_leads.sql`, para ir ao GitHub junto ao código. O arquivo não é executado automaticamente apenas por estar no GitHub.

```sql
-- Execute uma vez no SQL Editor do projeto Supabase correto.
-- Código versionável: não contém dados pessoais nem segredos.
begin;
create table public.black_november_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (phone ~ '^[0-9]{10,15}$'),
  campaign_consent boolean not null check (campaign_consent = true),
  marketing_consent boolean not null default false,
  notice_version text not null,
  campaign text not null default 'black-november-2026',
  utm jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.black_november_leads enable row level security;
revoke all on table public.black_november_leads from anon, authenticated;
grant insert on table public.black_november_leads to service_role;
create index black_november_leads_created_at_idx
  on public.black_november_leads (created_at desc);
commit;
```

A RLS fica habilitada, e os papéis de visitantes não recebem acesso direto à tabela. Não crie políticas de leitura pública. A secret key usada pelo servidor tem privilégios elevados e ignora RLS: mantenha-a somente nas variáveis de ambiente do servidor.

### 3. Configurar as variáveis

No projeto Supabase, copie a Project URL e uma secret key do painel de API Keys. Use a chave secreta atual `sb_secret_...`, não a publishable key. Esta implementação envia a secret key no cabeçalho `apikey` pelo servidor.

No VS Code, em `.env.local`, substitua os marcadores abaixo pelos valores reais:

```dotenv
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SECRET_KEY=sb_secret_SUBSTITUA_PELA_CHAVE_REAL
NEXT_PUBLIC_WHATSAPP_GROUP_URL=https://chat.whatsapp.com/SEU-CONVITE
NEXT_PUBLIC_PRIVACY_URL=https://SEU-DOMINIO/POLITICA-APROVADA
NEXT_PUBLIC_TERMS_URL=https://SEU-DOMINIO/TERMOS-APROVADOS
NEXT_PUBLIC_RULES_URL=https://SEU-DOMINIO/REGULAMENTO-APROVADO
```

Nunca use NEXT_PUBLIC_SUPABASE_SECRET_KEY. As variáveis SUPABASE_URL e SUPABASE_SECRET_KEY são lidas apenas no servidor. Os links públicos podem usar NEXT_PUBLIC. Remova as antigas LEADS_WEBHOOK_URL e LEADS_WEBHOOK_TOKEN: n8n não é necessário nesta versão.

Reinicie o servidor após editar:

```powershell
npm run dev
```

Na hospedagem, cadastre as mesmas variáveis no painel de configurações e faça novo deploy. O formulário só é habilitado quando banco, política e grupo estiverem configurados; isso não comprova que a conexão está correta, então faça o teste a seguir.

### 4. Verificar um cadastro

Abra http://localhost:3000/black-november. Use dados fictícios, preencha o telefone com código do país e DDD e envie. No Table Editor do Supabase, abra `black_november_leads` e confirme a nova linha. Confira nome, e-mail, telefone, UTMs e os dois consentimentos. Em seguida, confira a confirmação e o grupo oficial.

A data é gravada pelo banco. A rota só retorna sucesso depois da resposta de inserção; erro de conexão mantém os campos e mostra uma mensagem genérica. Cada novo envio cria uma nova linha: esta versão não deduplica. Em timeout, uma gravação pode ter ocorrido; confira antes de repetir.

Testes locais:

```powershell
npm test
npm run build
```

Os testes automatizados simulam a API do Supabase; não conectam no seu banco. O SQL ainda precisa ser executado no seu projeto. Para exclusões, retenção, acesso da equipe e backups, defina os procedimentos da WOA. Não coloque exportações dos leads no GitHub.

### 5. Salvar no Git e GitHub

Depois de conectar o repositório como explicado no guia principal:

```powershell
git status
git diff
git add src .env.example supabase README.md GUIA-COMPLETO.md SUPABASE-SETUP.md tests
git diff --cached
git commit -m "Integra cadastro ao Supabase"
git push
```

Adicione somente os caminhos que existirem na sua cópia. `.env.local` está no .gitignore e não deve aparecer no diff. As migrações SQL versionam a estrutura do banco; os registros permanecem no Supabase. Para manter backups dos registros, configure os recursos e a rotina de backup disponíveis no plano contratado.

### Documentação

- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/secure-data

## 6. Códigos completos — copie arquivo por arquivo

Você pode usar os arquivos já entregues no ZIP; não é necessário colar tudo de novo. Os blocos abaixo permitem reconstruir ou editar cada parte.

### 6.1. Base do projeto

Arquivo: `package.json`

```json
{
  "name": "woa-black-november",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "check": "tsc --noEmit",
    "test": "node --experimental-strip-types --test tests/leads.test.mjs"
  },
  "dependencies": {
    "next": "16.4.3",
    "react": "19.3.1",
    "react-dom": "19.3.1"
  },
  "devDependencies": {
    "typescript": "5.9.3",
    "@types/node": "22.20.5",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0"
  },
  "engines": {
    "node": ">=22.18.0"
  }
}
```

### 6.2. Configuração TypeScript

Arquivo: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "jsx": "react-jsx",
    "plugins": [
      {
        "name": "next"
      }
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "incremental": true,
    "isolatedModules": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 6.3. Arquivos ignorados no Git

Arquivo: `.gitignore`

```text
node_modules/
.next/
out/
.env*
!.env.example
*.log
*.tsbuildinfo
.vercel/
.DS_Store
Thumbs.db
```

### 6.4. Exemplo de variáveis sem segredos

Arquivo: `.env.example`

```text
SUPABASE_URL=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_WHATSAPP_GROUP_URL=
NEXT_PUBLIC_PRIVACY_URL=
NEXT_PUBLIC_TERMS_URL=
NEXT_PUBLIC_RULES_URL=
```

### 6.5. Tipos do Next.js

Arquivo: `next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";
import "./.next/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

### 6.6. Layout global e metadados

Arquivo: `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Black November WOA Talk | 30 dias grátis",
  description:
    "Experimente o WOA Talk Starter por 30 dias e participe de quatro aulas especiais de conversação.",
  alternates: { canonical: "https://woatalk.com.br/blacknovember" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

### 6.7. Rota inicial

Arquivo: `src/app/page.tsx`

```tsx
import { redirect } from "next/navigation";
export default function Home() {
  redirect("/black-november");
}
```

### 6.8. Conteúdo da campanha

Arquivo: `src/content/black-november.ts`

```typescript
export const campaign = {
  title: "BLACK NOVEMBER",
  subtitle: "Um mês para destravar sua conversação.",
  benefits: [
    [
      "01",
      "WOA Talk Starter",
      "30 dias de acesso gratuito após a ativação para conhecer o aplicativo gamificado.",
    ],
    [
      "02",
      "4 super aulas ao vivo",
      "Encontros especiais para praticar inglês com orientação e mais confiança.",
    ],
    [
      "03",
      "Oliver AI Tutor",
      "Conheça a proposta de inteligência artificial integrada, conforme os recursos disponíveis.",
    ],
    [
      "04",
      "WOA Play",
      "Conheça a biblioteca com mais de 400 aulas e materiais. Conteúdos liberados conforme a experiência.",
    ],
    [
      "05",
      "Comunidade WOA",
      "Orientações e avisos da campanha no grupo oficial do WhatsApp.",
    ],
    [
      "06",
      "Uma jornada com objetivo",
      "Descubra seus pontos de melhoria e caminhos para continuar evoluindo.",
    ],
  ],
  steps: [
    "Preencha seu nome, e-mail e WhatsApp.",
    "Entre no grupo oficial pela página de confirmação.",
    "Siga as orientações para criar ou acessar sua conta e solicitar a liberação do Starter.",
    "Acompanhe os links e participe das quatro aulas especiais.",
    "Depois da experiência, conheça as opções para continuar praticando.",
  ],
  classes: [
    ["05 NOV", "Destrave a fala"],
    ["12 NOV", "Pense e fale com mais naturalidade"],
    ["19 NOV", "Conversação na prática"],
    ["26 NOV", "Sua próxima etapa"],
  ],
  faq: [
    [
      "A inscrição é gratuita?",
      "Sim. A inscrição e a experiência anunciada são gratuitas, conforme as condições oficiais da campanha.",
    ],
    [
      "Quando começam os 30 dias?",
      "Quando o Starter é efetivamente liberado pela equipe. O formulário e a entrada no grupo não ativam o benefício.",
    ],
    [
      "Preciso ter uma conta?",
      "Você poderá criar uma conta ou acessar a existente seguindo as orientações recebidas no grupo.",
    ],
    [
      "Como recebo o acesso?",
      "Entre no grupo oficial após o cadastro e siga o procedimento informado pela equipe para liberação do Starter.",
    ],
    [
      "As aulas ao vivo são gratuitas?",
      "As quatro aulas especiais fazem parte da experiência anunciada, conforme as condições oficiais.",
    ],
    [
      "Quais idiomas posso estudar?",
      "A WOA trabalha com inglês, francês, espanhol, italiano e russo. A disponibilidade depende do produto e plano; as aulas especiais desta campanha têm foco em inglês.",
    ],
    [
      "Preciso contratar um plano ao final?",
      "Não. A experiência gratuita não obriga a contratação de um plano pago.",
    ],
    [
      "Como acompanho novidades e brindes?",
      "Pelo grupo oficial. Benefícios adicionais serão anunciados somente com suas condições de participação.",
    ],
  ],
};
```

### 6.9. Página principal — ordem das seções

Arquivo: `src/app/black-november/page.tsx`

```tsx
import CampaignHeader from "../../components/black-november/CampaignHeader";
import BlackNovemberHero from "../../components/black-november/BlackNovemberHero";
import BenefitsSection from "../../components/black-november/BenefitsSection";
import AboutSection from "../../components/black-november/AboutSection";
import HowItWorksSection from "../../components/black-november/HowItWorksSection";
import LiveClassesSchedule from "../../components/black-november/LiveClassesSchedule";
import PlansSection from "../../components/black-november/PlansSection";
import FAQSection from "../../components/black-november/FAQSection";
import FinalCTA from "../../components/black-november/FinalCTA";
import CampaignFooter from "../../components/black-november/CampaignFooter";
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
```

### 6.10. Cabeçalho

Arquivo: `src/components/black-november/CampaignHeader.tsx`

```tsx
export default function CampaignHeader() {
  return (
    <header className="campaign-header">
      <a href="#oferta" aria-label="WOA Talk — início">
        <img
          src="/images/logo-woa.jpeg"
          width="52"
          height="65"
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
```

### 6.11. Primeira dobra — oferta e formulário

Arquivo: `src/components/black-november/BlackNovemberHero.tsx`

```tsx
import LeadCaptureForm from "../LeadCaptureForm";
export default function BlackNovemberHero() {
  const privacy = process.env.NEXT_PUBLIC_PRIVACY_URL || "";
  const enabled = !!(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SECRET_KEY &&
    privacy &&
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL
  );
  return (
    <section className="hero" id="oferta">
      <div className="hero-inner">
        <p className="eyebrow">BLACK NOVEMBER WOA TALK</p>
        <h1>
          <span>30 DIAS</span>
          <mark>GRÁTIS.</mark>
        </h1>
        <h2>
          DE WOA TALK STARTER
          <br />
          <span>+ 4 AULAS AO VIVO</span>
        </h2>
        <p className="hero-promise">Um mês para destravar sua conversação.</p>
        <p className="offer-note">
          Experimente o aplicativo e pratique inglês em quatro encontros
          especiais.
        </p>
        <div className="offer-stamps">
          <span>ACESSO GRATUITO</span>
          <span>CONVERSAÇÃO EM INGLÊS</span>
          <span>SEM CONTRATAÇÃO OBRIGATÓRIA</span>
        </div>
        <LeadCaptureForm enabled={enabled} privacy={privacy} />
        <div className="hero-signoff" aria-hidden="true">
          <span>MERGULHE.</span>
          <span>PRATIQUE.</span>
          <span>EVOLUA.</span>
        </div>
      </div>
    </section>
  );
}
```

### 6.12. Formulário de inscrição

Arquivo: `src/components/LeadCaptureForm.tsx`

```tsx
"use client";
import { useState } from "react";
export default function LeadCaptureForm({
  enabled,
  privacy,
}: {
  enabled: boolean;
  privacy: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(e.currentTarget);
    const utm: Record<string, string> = {};
    const query = new URLSearchParams(location.search);
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]) {
      const v = query.get(key);
      if (v) utm[key] = v.slice(0, 200);
    }
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), utm }),
      });
      if (!r.ok)
        throw Error(
          "Não foi possível concluir seu cadastro. Confira os dados e tente novamente.",
        );
      location.assign("/black-november/confirmacao");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tente novamente.");
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} id="inscricao" className="form">
      <p className="form-intro">
        <strong>Cadastre-se gratuitamente</strong> e receba os detalhes da
        experiência.
      </p>
      <label>
        Nome completo
        <input
          required
          name="name"
          placeholder="Seu nome completo"
          autoComplete="name"
          minLength={3}
          maxLength={120}
        />
      </label>
      <label>
        Seu melhor e-mail
        <input
          required
          name="email"
          placeholder="Seu melhor e-mail"
          type="email"
          autoComplete="email"
          maxLength={254}
        />
      </label>
      <label>
        WhatsApp com código do país e DDD
        <input
          required
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+55 (61) 99999-9999"
          minLength={10}
          maxLength={25}
        />
      </label>
      <div className="trap" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="check">
        <input required type="checkbox" name="campaignConsent" />{" "}
        <span>
          Quero receber as orientações desta campanha e li a{" "}
          {privacy ? (
            <a href={privacy} target="_blank" rel="noreferrer">
              Política de Privacidade
            </a>
          ) : (
            "Política de Privacidade (em configuração)"
          )}
          .
        </span>
      </label>
      <label className="check">
        <input type="checkbox" name="marketingConsent" />
        <span>
          Também quero receber outras ofertas da WOA. Posso cancelar esse
          recebimento.
        </span>
      </label>
      <button disabled={!enabled || busy}>
        {busy ? "Enviando…" : "Quero meus 30 dias grátis →"}
      </button>
      {!enabled && (
        <small role="status">
          Inscrições em preparação. Aguarde a abertura oficial.
        </small>
      )}
      <p role="alert" className="error">
        {error}
      </p>
      <small>Sem obrigação de contratar um plano pago.</small>
    </form>
  );
}
```

### 6.13. Botão de inscrição compartilhado

Arquivo: `src/components/black-november/CTA.tsx`

```tsx
export default function CTA() {
  return (
    <a className="button" href="#inscricao">
      Quero participar gratuitamente <span aria-hidden="true">↗</span>
    </a>
  );
}
```

### 6.14. Benefícios

Arquivo: `src/components/black-november/BenefitsSection.tsx`

```tsx
import CTA from "./CTA";
import { campaign as c } from "../../content/black-november";
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
              src="/images/oceanos.png"
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
              src="/images/terra.png"
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
```

### 6.15. WOA e idiomas — Terra

Arquivo: `src/components/black-november/AboutSection.tsx`

```tsx
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
```

### 6.16. Como participar

Arquivo: `src/components/black-november/HowItWorksSection.tsx`

```tsx
import { campaign as c } from "../../content/black-november";
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
```

### 6.17. Calendário

Arquivo: `src/components/black-november/LiveClassesSchedule.tsx`

```tsx
import { campaign as c } from "../../content/black-november";
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
```

### 6.18. Continuidade — Galáxias

Arquivo: `src/components/black-november/PlansSection.tsx`

```tsx
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
              src="/images/galaxias.png"
              alt="Águia astronauta no universo Galáxias da WOA Talk"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 6.19. Perguntas frequentes

Arquivo: `src/components/black-november/FAQSection.tsx`

```tsx
import { campaign as c } from "../../content/black-november";
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
```

### 6.20. Chamada final

Arquivo: `src/components/black-november/FinalCTA.tsx`

```tsx
import CTA from "./CTA";
export default function FinalCTA() {
  return (
    <section className="final">
      <div className="wrap narrow">
        <p className="eyebrow">BLACK NOVEMBER WOA TALK</p>
        <h2>
          SEU INGLÊS.
          <br />
          <mark>NA PRÁTICA.</mark>
        </h2>
        <p>
          30 dias de Starter + 4 aulas especiais ao vivo.
          <br />O primeiro passo é seu.
        </p>
        <CTA />
        <small>
          Inscrição gratuita. Condições conforme o regulamento oficial da
          campanha.
        </small>
      </div>
    </section>
  );
}
```

### 6.21. Rodapé

Arquivo: `src/components/black-november/CampaignFooter.tsx`

```tsx
export default function CampaignFooter() {
  const privacy = process.env.NEXT_PUBLIC_PRIVACY_URL || "";
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
```

### 6.22. Página de confirmação

Arquivo: `src/app/black-november/confirmacao/page.tsx`

```tsx
import CampaignFooter from "../../../components/black-november/CampaignFooter";
export const metadata = {
  title: "Próximo passo | WOA Talk",
  robots: { index: false, follow: false },
};
export default function Confirmation() {
  const link = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL;
  return (
    <>
      <main className="confirmation">
        <div className="wrap narrow">
          <img
            className="confirmation-logo"
            src="/images/logo-woa.jpeg"
            alt="WOA Talk"
            width="64"
            height="80"
          />
          <p className="eyebrow">BLACK NOVEMBER WOA TALK</p>
          <h1>
            VOCÊ ESTÁ
            <br />
            <mark>QUASE LÁ!</mark>
          </h1>
          <p>
            Falta um passo para acompanhar a experiência.
            <br />
            Entre no <strong>grupo oficial do WhatsApp</strong> para receber as
            orientações e os avisos das aulas.
          </p>
          {link ? (
            <a
              className="button whatsapp"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Entrar no grupo oficial →
            </a>
          ) : (
            <p className="pending-message" role="status">
              O link do grupo será disponibilizado em breve.
            </p>
          )}
          <small>
            Após o cadastro, siga as orientações da equipe. Os 30 dias começam
            quando o Starter for liberado.
          </small>
          <a className="back-link" href="/black-november">
            Voltar à campanha
          </a>
        </div>
      </main>
      <CampaignFooter />
    </>
  );
}
```

### 6.23. API em Node.js

Arquivo: `src/app/api/leads/route.ts`

```typescript
export const runtime = "nodejs";
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin)
    return Response.json({ error: "Origem inválida" }, { status: 403 });
  if (!req.headers.get("content-type")?.includes("application/json"))
    return new Response(null, { status: 415 });
  const text = await req.text();
  if (text.length > 5000) return new Response(null, { status: 413 });
  let d;
  try {
    d = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (
    !d ||
    typeof d !== "object" ||
    typeof d.name !== "string" ||
    d.name.trim().length < 3 ||
    d.name.length > 120 ||
    typeof d.email !== "string" ||
    d.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) ||
    typeof d.phone !== "string" ||
    !/^\d{10,15}$/.test(d.phone.replace(/\D/g, "")) ||
    d.campaignConsent !== "on" ||
    d.website
  )
    return Response.json({ error: "Dados inválidos" }, { status: 400 });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (
    !url ||
    !key ||
    !process.env.NEXT_PUBLIC_PRIVACY_URL ||
    !process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL
  )
    return Response.json(
      { error: "Inscrições em preparação" },
      { status: 503 },
    );
  const utm: Record<string, string> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ])
    if (typeof d.utm?.[key] === "string") utm[key] = d.utm[key].slice(0, 200);
  try {
    const r = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/black_november_leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: d.name.trim(),
          email: d.email.trim().toLowerCase(),
          phone: d.phone.replace(/\D/g, ""),
          campaign_consent: true,
          marketing_consent: d.marketingConsent === "on",
          notice_version: "black-november-v1",
          campaign: "black-november-2026",
          utm,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!r.ok) throw Error();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Falha no recebimento" }, { status: 502 });
  }
}
```

### 6.24. Visual e responsividade

Arquivo: `src/app/globals.css`

```css
/* WOA Talk / Black November — campanha V2 */
:root {
  --ink: #091923;
  --navy: #071723;
  --cyan: #6ccfdf;
  --yellow: #f8f53c;
  --green: #10c77a;
  --purple: #7651cb;
  --paper: #fff;
  --muted: #53606b;
  --display:
    Impact, "Arial Narrow", "Franklin Gothic Condensed", Arial, sans-serif;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 24px;
}
body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.55;
}
img {
  max-width: 100%;
  display: block;
}
a {
  color: inherit;
}
button,
input {
  font: inherit;
}
section {
  padding: 78px 24px;
}
.wrap {
  max-width: 1080px;
  margin: 0 auto;
}
.narrow {
  max-width: 760px;
}
h1,
h2,
h3,
p {
  margin-top: 0;
}
h1,
h2 {
  font-family: var(--display);
  font-weight: 900;
  letter-spacing: -0.025em;
  line-height: 1.04;
}
h2 {
  font-size: clamp(38px, 5.5vw, 68px);
  margin-bottom: 24px;
}
h3 {
  line-height: 1.16;
}
mark {
  background: var(--yellow);
  color: var(--ink);
  padding: 0 0.08em;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
em {
  font-style: normal;
}
.eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 18px;
}
.button,
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 54px;
  padding: 16px 28px;
  background: var(--green);
  color: #041c14;
  border: 0;
  border-radius: 12px;
  box-shadow: 0 4px 0 #087f52;
  font-size: 17px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.15s;
}
.button:hover,
button:not(:disabled):hover {
  background: #30db95;
  transform: translateY(-1px);
}
a:focus-visible,
button:focus-visible,
input:focus-visible,
summary:focus-visible {
  outline: 3px solid #6741ce;
  outline-offset: 4px;
}
.campaign-header {
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 5%;
  gap: 16px;
  background: var(--navy);
  color: white;
}
.campaign-header img {
  width: 48px;
  height: 60px;
  object-fit: contain;
  border-radius: 7px;
}
.campaign-lockup {
  display: flex;
  flex-direction: column;
  text-align: center;
}
.campaign-lockup b {
  font-family: var(--display);
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.campaign-lockup span {
  font-size: 9px;
  letter-spacing: 0.2em;
  margin-top: 5px;
}
.header-cta {
  font-size: 12px;
  text-underline-offset: 5px;
}
.hero {
  position: relative;
  isolation: isolate;
  text-align: center;
  background: var(--cyan);
  padding: 42px 24px 0;
  overflow: hidden;
}
.hero:before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(#6ccfdfec 0%, #6ccfdfeb 65%, #6ccfdf9e),
    url("/images/oceanos.png") center 62% / cover;
}
.hero-inner {
  max-width: 820px;
  margin: auto;
}
.hero .eyebrow {
  font-size: 12px;
  letter-spacing: 0.2em;
  margin-bottom: 18px;
}
.hero h1 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.15em;
  font-size: clamp(54px, 9vw, 106px);
  margin: 0 0 12px;
}
.hero h1 span {
  white-space: nowrap;
}
.hero h1 mark {
  display: inline-block;
  transform: rotate(-2deg);
  padding: 0.02em 0.09em;
}
.hero h2 {
  font-size: clamp(28px, 4vw, 44px);
  margin: 0 0 20px;
}
.hero h2 span {
  display: inline-block;
  margin-top: 5px;
}
.hero-promise {
  font-size: clamp(18px, 2.4vw, 24px);
  font-weight: 800;
  margin-bottom: 8px;
}
.offer-note {
  font-size: 15px;
  margin: 0 auto 16px;
  max-width: 550px;
}
.offer-stamps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 14px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
}
.offer-stamps span + span:before {
  content: "✦";
  margin-right: 14px;
}
.form {
  max-width: 620px;
  margin: 0 auto;
  text-align: left;
  scroll-margin-top: 24px;
}
.form-intro {
  text-align: center;
  font-size: 15px;
  margin-bottom: 16px;
}
.form label:not(.check) {
  display: block;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
}
.form input:not([type="checkbox"]) {
  display: block;
  width: 100%;
  height: 48px;
  margin-top: 4px;
  padding: 0 18px;
  border: 1px solid #bac3ca;
  background: white;
  border-radius: 28px;
  font-size: 16px;
  color: var(--ink);
}
.form input::placeholder {
  color: #68717a;
  opacity: 1;
}
.form .check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 10px;
  line-height: 1.5;
  margin: 10px 0;
  text-align: left;
}
.check input {
  accent-color: #08664e;
  flex-shrink: 0;
  margin: 2px 0 0;
  width: 14px;
  height: 14px;
}
.form button {
  width: 100%;
  margin-top: 8px;
  min-height: 56px;
}
.form button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: 0 3px 0 #3e8677;
}
.form small {
  display: block;
  font-size: 10px;
  text-align: center;
  margin-top: 12px;
}
.error:empty {
  display: none;
}
.error {
  font-size: 12px;
  color: #842121;
  margin: 14px 0 0;
}
.trap {
  display: none;
}
.hero-signoff {
  display: flex;
  justify-content: center;
  gap: 0.2em;
  flex-wrap: wrap;
  font-family: var(--display);
  font-size: clamp(34px, 7vw, 76px);
  line-height: 1.05;
  margin: 36px -10px 0;
  color: #061b26;
  opacity: 0.95;
}
.hero-signoff span:nth-child(2) {
  color: var(--yellow);
}
.ribbon {
  padding: 16px 20px;
  background: var(--navy);
  color: white;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.05em;
  font-weight: 800;
}
.ribbon span {
  padding: 0 16px;
  color: var(--yellow);
}
.section-light {
  background: #fff;
}
.section-heading {
  text-align: center;
  margin-bottom: 42px;
}
.section-heading > p:last-child {
  max-width: 650px;
  margin: 20px auto 0;
  color: var(--muted);
  font-size: 17px;
}
.section-heading .eyebrow {
  color: #54616b;
}
.feature-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #f3f0fa;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 28px;
  min-height: 440px;
}
.feature-copy {
  padding: 38px 34px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.feature-label {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.12em;
  margin-bottom: 22px;
}
.feature-copy h3 {
  font-family: var(--display);
  font-size: clamp(30px, 3.6vw, 43px);
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}
.feature-copy p {
  font-size: 15px;
  max-width: 360px;
  color: #465460;
}
.feature-copy small {
  font-size: 10px;
  max-width: 330px;
  color: #53616b;
}
.big-number {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--display);
  font-size: 92px;
  line-height: 1;
  margin: 8px 0 20px;
}
.big-number span {
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.15;
}
.feature-art {
  position: relative;
  min-height: 440px;
  overflow: hidden;
}
.feature-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}
.ocean-panel .feature-art img {
  object-position: center 65%;
}
.earth-panel {
  background: #fff4c5;
}
.earth-panel .feature-art img {
  object-position: 65% 35%;
}
.art-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
  background: #061b26b8;
  padding: 8px 12px;
  border-radius: 4px;
}
.extras-heading {
  text-align: center;
  margin: 44px 0 22px;
}
.extras-heading h3 {
  font-family: var(--display);
  font-size: 32px;
  margin-bottom: 8px;
}
.extras-heading p {
  color: var(--muted);
  font-size: 14px;
}
.extras {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 28px;
}
.extras article {
  display: flex;
  gap: 14px;
  padding: 22px 0;
  border-top: 1px solid #dae0e5;
}
.extras article > span {
  font-family: var(--display);
  font-size: 24px;
  color: #00718c;
}
.extras h3 {
  font-size: 17px;
  margin-bottom: 8px;
}
.extras p {
  font-size: 13px;
  color: #53616b;
  margin-bottom: 0;
}
.center-cta {
  text-align: center;
  margin-top: 32px;
}
.center-cta .button {
  width: min(100%, 620px);
}
.languages-section {
  text-align: center;
  background: #f4f1fb;
}
.languages-section p:not(.eyebrow) {
  font-size: 17px;
  max-width: 600px;
  margin: 24px auto 12px;
}
.languages-section small {
  display: block;
  color: var(--muted);
  font-size: 11px;
  max-width: 620px;
  margin: auto;
}
.language-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
}
.language-pills > span {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
}
.language-pills b {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--navy);
  color: #fff;
  font-size: 10px;
}
.steps {
  list-style: none;
  padding: 0;
  margin: 42px 0 0;
  display: grid;
  gap: 28px;
}
.steps li {
  position: relative;
  background: #f2f0f6;
  border-radius: 20px;
  padding: 32px 26px 22px;
}
.steps li > span {
  position: absolute;
  left: 22px;
  top: -12px;
  background: var(--yellow);
  padding: 5px 14px;
  border-radius: 20px;
  box-shadow: 0 3px 8px #1a15221a;
  font-size: 12px;
  font-weight: 900;
  transform: rotate(-2deg);
}
.steps p {
  margin: 0;
  font-size: 16px;
}
.schedule-section {
  background: var(--navy);
  color: #fff;
}
.schedule-section .eyebrow {
  color: #b5c4d1;
}
.calendar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.calendar article {
  padding: 22px 18px;
  background: #132935;
  border-radius: 14px;
  border-top: 4px solid var(--cyan);
}
.lesson-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #c1d1d9;
}
.calendar strong {
  display: block;
  font-family: var(--display);
  font-size: 39px;
  color: var(--yellow);
  line-height: 1.1;
  margin: 18px 0;
}
.calendar h3 {
  font-size: 16px;
  margin-bottom: 18px;
}
.calendar p {
  font-size: 11px;
  color: #c1d1d9;
  margin: 0;
}
.schedule-note {
  text-align: center;
  font-size: 10px;
  color: #c1d1d9;
  margin: 22px 0 0;
}
.next-level {
  background: #efecf8;
}
.next-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 44px;
  align-items: center;
}
.next-grid h2 {
  font-size: clamp(36px, 4.6vw, 58px);
}
.next-grid > div > p:not(.eyebrow) {
  font-size: 16px;
  max-width: 450px;
}
.plan-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0;
}
.plan-pills span {
  background: #fff;
  border: 1px solid #d6cfea;
  padding: 8px 14px;
  font-weight: 800;
  font-size: 12px;
  border-radius: 8px;
}
.next-grid .fine-print {
  font-size: 11px !important;
  color: #53616b;
}
.galaxy-art {
  height: 470px;
  overflow: hidden;
  border-radius: 24px;
  position: relative;
}
.galaxy-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 70% 60%;
}
.faq-section .section-heading {
  margin-bottom: 28px;
}
details {
  border-bottom: 1px solid #d9dfe3;
  padding: 18px 0;
}
summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  font-size: 15px;
  font-weight: 700;
}
summary::-webkit-details-marker {
  display: none;
}
summary span {
  font-size: 24px;
  font-weight: 400;
  color: #59707c;
  line-height: 1;
}
details[open] summary span {
  transform: rotate(45deg);
}
details p {
  font-size: 14px;
  color: #53616b;
  margin: 12px 30px 0 0;
}
.final {
  text-align: center;
  background: var(--cyan);
  position: relative;
  isolation: isolate;
}
.final:before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(#6ccfdfe8, #6ccfdfe8),
    url("/images/oceanos.png") center/cover;
  z-index: -1;
}
.final h2 {
  font-size: clamp(52px, 7vw, 86px);
}
.final p:not(.eyebrow) {
  font-size: 19px;
}
.final .button {
  width: min(100%, 620px);
}
.final small {
  display: block;
  font-size: 10px;
  margin-top: 22px;
}
footer {
  background: var(--navy);
  color: white;
  text-align: center;
  padding: 36px 24px;
  font-size: 12px;
}
footer > p {
  font-size: 11px;
  color: #b7c5ce;
  margin: 10px 0;
}
footer nav {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 18px 0;
}
footer nav a {
  font-size: 11px;
}
footer small {
  font-size: 10px;
  color: #a2b4c0;
}
.confirmation {
  min-height: 80vh;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 70px 24px;
  background: #fff;
}
.confirmation-logo {
  margin: 0 auto 24px;
  object-fit: contain;
}
.confirmation h1 {
  font-size: clamp(56px, 8vw, 92px);
  margin: 24px 0 30px;
}
.confirmation p:not(.eyebrow) {
  font-size: 17px;
  color: #53616b;
}
.confirmation .button {
  margin: 12px 0 20px;
}
.confirmation small {
  display: block;
  font-size: 11px;
  color: #53616b;
  max-width: 520px;
  margin: auto;
}
.back-link {
  display: inline-block;
  font-size: 12px;
  margin-top: 24px;
  text-underline-offset: 4px;
}
.pending-message {
  background: #f4f1fb;
  padding: 18px;
  border-radius: 10px;
}
.skip {
  position: absolute;
  top: -100px;
  left: 10px;
  z-index: 30;
  background: white;
  color: black;
  padding: 12px;
}
.skip:focus {
  top: 10px;
}
@media (max-width: 760px) {
  section {
    padding: 54px 20px;
  }
  .campaign-header {
    min-height: 76px;
    padding: 8px 20px;
  }
  .campaign-header img {
    width: 40px;
    height: 50px;
  }
  .campaign-lockup b {
    font-size: 23px;
  }
  .campaign-lockup span {
    font-size: 8px;
  }
  .header-cta {
    display: none;
  }
  .hero {
    padding: 32px 20px 0;
  }
  .hero h1 {
    font-size: clamp(44px, 10vw, 76px);
  }
  .hero h2 {
    font-size: clamp(25px, 5.6vw, 36px);
  }
  .hero-promise {
    font-size: 19px;
  }
  .offer-note {
    font-size: 14px;
  }
  .offer-stamps {
    font-size: 8px;
    gap: 6px 10px;
  }
  .offer-stamps span + span:before {
    margin-right: 10px;
  }
  .form {
    max-width: 560px;
  }
  .hero-signoff {
    font-size: clamp(27px, 6.8vw, 48px);
    margin-top: 28px;
  }
  .ribbon {
    font-size: 9px;
    line-height: 1.8;
    padding: 12px;
  }
  .ribbon span {
    padding: 0 6px;
  }
  .section-heading {
    margin-bottom: 30px;
  }
  .section-heading > p:last-child {
    font-size: 15px;
  }
  h2 {
    font-size: clamp(35px, 7.2vw, 50px);
  }
  .feature-panel {
    grid-template-columns: 1fr;
    min-height: 0;
    border-radius: 18px;
  }
  .feature-copy {
    padding: 28px;
  }
  .feature-copy h3 {
    font-size: 34px;
  }
  .feature-copy p {
    max-width: 500px;
  }
  .feature-art {
    min-height: 320px;
  }
  .ocean-panel .feature-art img {
    object-position: center 63%;
  }
  .earth-panel .feature-art img {
    object-position: center 31%;
  }
  .big-number {
    font-size: 76px;
  }
  .extras {
    gap: 0 18px;
  }
  .extras article {
    gap: 10px;
  }
  .extras h3 {
    font-size: 15px;
  }
  .extras p {
    font-size: 12px;
  }
  .language-pills {
    gap: 8px;
  }
  .language-pills > span {
    padding: 8px 10px;
    font-size: 12px;
  }
  .calendar {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .calendar strong {
    font-size: 34px;
  }
  .next-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .next-grid .button {
    width: 100%;
  }
  .galaxy-art {
    height: 360px;
  }
  .galaxy-art img {
    object-position: 70% 58%;
  }
  .steps p {
    font-size: 15px;
  }
  .final p:not(.eyebrow) {
    font-size: 17px;
  }
  summary {
    font-size: 14px;
  }
  .confirmation {
    min-height: 75vh;
  }
  .confirmation h1 {
    font-size: 60px;
  }
}
@media (max-width: 390px) {
  .hero h1 {
    font-size: 42px;
  }
  .hero h2 {
    font-size: 25px;
  }
  .offer-stamps {
    font-size: 7px;
  }
  .extras {
    grid-template-columns: 1fr;
  }
  .calendar article {
    padding: 18px 12px;
  }
  .calendar strong {
    font-size: 30px;
  }
  .button,
  button {
    font-size: 15px;
    padding: 16px 18px;
  }
  .feature-copy {
    padding: 24px;
  }
  .hero-signoff {
    font-size: 25px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .button,
  button {
    transition: none;
  }
}
```

### 6.25. Testes da API

Arquivo: `tests/leads.test.mjs`

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/leads/route.ts";
const payload = {
  name: "Pessoa Teste",
  email: "teste@example.org",
  phone: "+5561999999999",
  campaignConsent: "on",
  website: "",
  utm: { utm_source: "teste" },
};
const req = (data) =>
  new Request("https://example.org/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.org",
    },
    body: JSON.stringify(data),
  });
test("validação e entrega do cadastro", async () => {
  assert.equal(
    (await POST(req({ ...payload, email: "inválido" }))).status,
    400,
  );
  assert.equal(
    (await POST(req({ ...payload, campaignConsent: "" }))).status,
    400,
  );
  delete process.env.SUPABASE_URL;
  assert.equal((await POST(req(payload))).status, 503);
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test_only";
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.NEXT_PUBLIC_PRIVACY_URL = "https://example.org/privacidade";
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL =
    "https://chat.whatsapp.com/example";
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(null, { status: 500 });
    assert.equal((await POST(req(payload))).status, 502);
    let sent;
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://project.supabase.co/rest/v1/black_november_leads");
      assert.equal(init.headers.apikey, "sb_secret_test_only");
      assert.equal(init.headers.Prefer, "return=minimal");
      sent = JSON.parse(init.body);
      return new Response(null, { status: 201 });
    };
    assert.equal((await POST(req(payload))).status, 200);
    assert.equal(sent.marketing_consent, false);
    assert.equal(sent.phone, "5561999999999");
    assert.equal(sent.utm.utm_source, "teste");
  } finally {
    globalThis.fetch = original;
  }
});
```

### 6.26. Verificação automática no GitHub

Arquivo: `.github/workflows/checks.yml`

```yaml
name: Validar campanha
on: [push, pull_request]
jobs:
  validar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## 7. Testar antes de salvar

No terminal, na pasta que contém package.json:

```powershell
npm test
npm run build
```

`npm test` testa rejeição de dados inválidos, configuração ausente, erro do banco e inserção simulada. Não usa a planilha real. O build valida compilação e tipos. A integração real e os testes visuais precisam ser feitos por você/equipe no ambiente configurado.

Teste manualmente:

1. Formulário sem preencher e com e-mail inválido.
2. Cadastro fictício com telefone incluindo país e DDD.
3. Linha efetivamente salva no Supabase e redirecionamento.
4. Botão abrindo o grupo oficial correto.
5. Falha do Supabase: erro visível, dados preservados e sem sucesso falso.
6. Consentimento promocional inicialmente desmarcado e registrado como false se não escolhido.
7. Celular: campos legíveis, sem rolagem horizontal, botões acessíveis e teclado apropriado.
8. Calendário, documentos, condições do Starter e conteúdo conferidos pela equipe.

## 8. Primeiro salvamento no Git

Git guarda versões no computador. GitHub recebe essas versões quando você executa push. Ctrl+S salva o arquivo, mas não cria commit nem envia ao GitHub.

Para uma nova pasta extraída do ZIP (sem .git), execute:

```powershell
git init -b main
git config user.name "SEU NOME"
git config user.email "SEU EMAIL DO GITHUB"
git status
```

Troque os dois valores entre aspas. Você pode usar o e-mail de privacidade fornecido pelo GitHub. Antes de adicionar arquivos, confirme que `.gitignore` está criado.

```powershell
git add .
git diff --cached --stat
git diff --cached
git commit -m "Cria campanha Black November WOA Talk"
```

Revise o diff. `.env.local`, node_modules e .next não devem aparecer. Não ignore erros de commit: configure a identidade e execute novamente.

Se estiver trabalhando no repositório existente da WOA, use `git clone URL-REAL-DO-REPOSITORIO`, entre na pasta e crie uma branch com `git switch -c campanha/black-november`. Não use git init por cima de outro projeto nem substitua o projeto inteiro pelos arquivos deste exemplo.

## 9. Criar o repositório no GitHub e enviar

1. Entre na conta correta no GitHub.
2. Clique em **New repository**.
3. Nome sugerido: `woa-black-november`.
4. Escolha **Private** enquanto estiver desenvolvendo.
5. Deixe desmarcada a criação de README, .gitignore e licença, pois o projeto local já existe.
6. Crie o repositório e copie a URL HTTPS apresentada.

No terminal, substitua USUARIO-OU-ORGANIZACAO pelo proprietário real:

```powershell
git remote add origin https://github.com/USUARIO-OU-ORGANIZACAO/woa-black-november.git
git remote -v
git push -u origin main
```

Faça o login pelo fluxo oferecido pelo Git/VS Code no navegador. Não coloque tokens no código ou na URL do remote. Se já houver um remote origin, confira `git remote -v` antes de qualquer alteração. Não adicione outro origin e não use force push para resolver divergência.

Atualize a página do repositório no GitHub e confira os arquivos. Este é o momento em que seu código fica salvo remotamente. O envio ao seu GitHub ainda depende do repositório e autenticação reais; o pacote por si só não publica arquivos na conta.

## 10. Rotina de salvamento em cada alteração

Antes de começar, numa branch já conectada:

```powershell
git status
git pull --ff-only
```

Se houver alterações locais ou divergência, pare para revisar em vez de sobrescrever. Para cada bloco de trabalho concluído:

```powershell
npm test
npm run build
git status
git diff
git add .
git diff --cached
git commit -m "Ajusta textos e layout da campanha"
git push
```

Troque a mensagem pela alteração feita. Faça commits pequenos (ex.: formulário; calendário; revisão de copy). `git log --oneline -5` mostra os commits locais. Confira o mesmo commit no GitHub após o push.

O arquivo `.github/workflows/checks.yml` incluído executa os testes e o build em pushes/PRs, quando GitHub Actions estiver habilitado. Ele valida o código; não faz o push por você.

## 11. Publicação e domínio

Se `woatalk.com.br` já está em outro projeto, integre esta rota ao repositório atual por uma branch e revisão. O código não muda o domínio nem cria uma hospedagem automaticamente.

Se optar por Vercel para um novo projeto:

1. Conecte a conta ao GitHub e importe o repositório.
2. Confirme o framework Next.js e a pasta que contém package.json como raiz.
3. Adicione as variáveis de ambiente nas configurações do projeto, para os ambientes necessários.
4. Faça o deploy e teste a URL fornecida pela plataforma.
5. Peça ao responsável pelo domínio para integrar a rota ou conectar o domínio somente depois de confirmar como o site atual é hospedado. Não altere o DNS do site inteiro para publicar apenas uma campanha sem planejar a integração.

Com a integração Git ativa na hospedagem, novos pushes podem disparar deploys conforme a configuração. Arquivo salvo no editor ainda precisa de commit e push.

## 12. Recuperar o histórico preparado neste pacote

O ZIP inclui `woa-black-november-history.bundle`, um backup do histórico Git local preparado nesta entrega. Para continuar com esse histórico em vez de iniciar do zero, extraia o ZIP e, na pasta que contém o bundle, execute:

```powershell
git clone ./woa-black-november-history.bundle woa-com-historico
cd woa-com-historico
git remote remove origin
git config user.name "SEU NOME"
git config user.email "SEU EMAIL DO GITHUB"
```

Depois configure o remote GitHub real e faça o push como na etapa 9. O nome do autor do commit inicial do pacote identifica o assistente; configure sua identidade para os seus próprios commits. O bundle não contém dependências nem credenciais. Se preferir uma história nova, use a pasta de código do ZIP e a etapa 8.

## Documentação oficial consultada

- [Instalação do Next.js](https://nextjs.org/docs/app/getting-started/installation)
- [Enviar código local ao GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
- [Variáveis de ambiente na Vercel](https://vercel.com/docs/environment-variables)
- [Supabase API Keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
