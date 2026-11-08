# Conectar a campanha ao Supabase

Os cadastros ficam no banco de dados Supabase. O GitHub guarda o código e a migração SQL. Conectar contas não copia registros do banco ao GitHub e não substitui backups.

## 1. Criar o projeto

Entre em https://supabase.com/dashboard, crie um projeto para a WOA e guarde a senha do banco em um gerenciador de senhas. Escolha a região adequada à operação. Não envie senha ou secret key no chat.

## 2. Criar a tabela

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

## 3. Configurar as variáveis

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

## 4. Verificar um cadastro

Abra http://localhost:3000/black-november. Use dados fictícios, preencha o telefone com código do país e DDD e envie. No Table Editor do Supabase, abra `black_november_leads` e confirme a nova linha. Confira nome, e-mail, telefone, UTMs e os dois consentimentos. Em seguida, confira a confirmação e o grupo oficial.

A data é gravada pelo banco. A rota só retorna sucesso depois da resposta de inserção; erro de conexão mantém os campos e mostra uma mensagem genérica. Cada novo envio cria uma nova linha: esta versão não deduplica. Em timeout, uma gravação pode ter ocorrido; confira antes de repetir.

Testes locais:

```powershell
npm test
npm run build
```

Os testes automatizados simulam a API do Supabase; não conectam no seu banco. O SQL ainda precisa ser executado no seu projeto. Para exclusões, retenção, acesso da equipe e backups, defina os procedimentos da WOA. Não coloque exportações dos leads no GitHub.

## 5. Salvar no Git e GitHub

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

## Documentação

- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/secure-data
