# Cadastro público de interessados

## Estado da integração

O formulário envia nome, e-mail, WhatsApp com código do país e `campaign_consent: true` para `POST /api/leads`. A rota usa a API REST oficial do Supabase e faz somente INSERT em `public.black_november_leads`. Não consulta a lista de interessados, não usa upsert e não altera/exclui registros. O cadastro não confirma pagamento nem matrícula.

O usuário autorizou cadastrar interessados sem login e testar um novo registro com seus próprios dados no projeto `woa-talk` de produção. Essa autorização não publica o site nem modifica outras aplicações. Nenhuma conexão real ou alteração de permissões foi realizada nesta sessão: as credenciais estão no computador do usuário, não no ambiente remoto.

## Credenciais locais já configuradas

Preserve o `.env.local` existente na raiz do projeto:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Os valores acima são marcadores de documentação, não credenciais utilizáveis. Aceita `sb_publishable_...` ou chave JWT legada com role `anon`. Não aceita `sb_secret_...` nem JWT `service_role`. Não envie chaves pelo chat, não as imprima e não versione `.env.local`.

Com as duas variáveis válidas, o cadastro está habilitado. Opcionalmente, `LEAD_CAPTURE_ENABLED=false` pausa o envio; não é necessário adicionar essa variável para ativar. Reinicie o servidor após alterar o arquivo.

A página é renderizada no servidor para conferir disponibilidade de configuração em cada requisição. As credenciais não são passadas como props ao formulário. O prefixo da subrota é respeitado também em `/api/leads`. A API é compatível com o runtime Node.js do Next.js na Vercel; não é um export estático.

## Conferir permissões antes de aplicar SQL

1. No painel Supabase, confirme o projeto `woa-talk`.
2. Abra **SQL Editor → New query**.
3. Execute apenas o conteúdo de `supabase/01-inspect-leads.sql`. Ele consulta metadados (colunas/defaults, RLS, políticas e grants), sem ler contatos.
4. Confira se `name`, `email`, `phone` são campos de texto e `campaign_consent` é booleano. Os demais campos obrigatórios precisam de defaults, identidade ou geração automática. O código não presume valores para colunas não vistas na captura.
5. Se RLS já estiver ativo e houver política adequada de INSERT para `anon`, não duplique políticas. O acesso de INSERT pode já estar funcionando.
6. Se faltar a permissão, após conferir a estrutura, execute `supabase/02-public-lead-insert.sql`. O script exige RLS ativo, concede INSERT dos quatro campos e cria uma política com validação. Não concede leitura, atualização ou exclusão e não remove permissões existentes.

Se o script indicar RLS desativado, outro campo obrigatório ou política já existente, pare e revise o resultado. Não desative RLS e não troque por chave administrativa para contornar erros. Habilitar RLS numa tabela já utilizada pode afetar outros consumidores: a configuração existente deve ser examinada antes. Políticas existentes são combinadas pelo Postgres; esta política não revoga permissões amplas que já existam.

Os scripts não são executados automaticamente pelo build ou pelo servidor. Não há migrations automáticas.

## Testar com seus próprios dados

1. Atualize o código local a partir da branch `desenvolvimento/superaulas`, preservando `.env.local`.
2. Execute `npm.cmd test` e `npm.cmd run build` (não gravam no banco).
3. Inicie `npm.cmd run dev` e abra http://localhost:3000 (ou a subrota configurada).
4. Na seção **Quer saber mais sobre as turmas?**, informe seu nome, seu e-mail e seu WhatsApp com DDI/DDD; marque a autorização de contato e envie uma única vez.
5. A mensagem “Cadastro recebido!” aparece somente após confirmação da API. No Supabase Table Editor, confira manualmente o novo registro pelos seus dados; não edite nem exclua registros anteriores.
6. Se houver timeout ou falha ambígua, confira no painel antes de reenviar para evitar duplicatas. A rota não faz tentativas automáticas nem deduplicação por consulta/upsert.

Em erro de permissão, confira as políticas e os logs do Supabase. As respostas da página não mostram mensagens internas do banco, chaves ou dados pessoais. Outros bloqueios possíveis: campo obrigatório sem default, tipo de coluna diferente, chave/URL incorreta ou indisponibilidade da API.

## Vercel — etapa posterior

Ainda falta confirmar o projeto Vercel exclusivo desta landing page. No projeto correto, usar as mesmas variáveis em **Development/Preview**, preservando as existentes. O usuário autorizou este banco real como destino; Preview conectado a ele também grava nele.

Não incluir token da Vercel na aplicação. Nenhum projeto Vercel, domínio, deploy ou variável remota foi alterado nesta entrega. As variáveis `NEXT_PUBLIC_*` devem ser configuradas antes de um futuro build/deploy e nunca podem conter chaves administrativas.

## Validação e limites

Testes automatizados usam banco simulado e dados fictícios locais: consentimento obrigatório, normalização, whitelist de campos, origem, limite de corpo, credenciais administrativas rejeitadas, falhas de rede/RLS, ausência de consulta/upsert e feedback do formulário. Nenhum teste grava no projeto real.

Há honeypot e proteção contra duplo clique no formulário. Isso não equivale a rate limiting distribuído ou proteção anti-bot: a chave publicável e uma política de INSERT público permitem chamadas diretas ao Supabase. Limites/captcha podem ser adicionados numa etapa específica antes de ampla divulgação. Nenhuma política de privacidade ou prazo de retenção foi inventado; a equipe deve fornecer os documentos oficiais para publicação.
