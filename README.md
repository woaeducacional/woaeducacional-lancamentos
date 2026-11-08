# WOA Talk — Black November / Supabase

Next.js + Node.js para captura e confirmação. Dados no Supabase; código e SQL no Git/GitHub.

Leia GUIA-COMPLETO.md para instalar, copiar os códigos por seção e salvar no GitHub.

## Executar
Node.js 24 LTS. `npm ci`, copie `.env.example` para `.env.local`, configure os dados oficiais e execute `npm run dev`.

## Conectar o banco
Crie um projeto Supabase e execute uma vez o SQL em `supabase/migrations/202610300001_create_black_november_leads.sql` no SQL Editor do projeto correto. A tabela terá RLS habilitada e não permitirá acesso direto aos papéis anon/authenticated. O servidor usa uma secret key no cabeçalho apikey. Não crie políticas públicas para os leads.

Configure SUPABASE_URL e SUPABASE_SECRET_KEY somente no servidor (.env.local ou variáveis da hospedagem). Nunca use prefixo NEXT_PUBLIC para a secret key. Configure também os links oficiais de WhatsApp e documentos. Reinicie o servidor local; após alterar variáveis na hospedagem, faça novo deploy. O formulário fica desabilitado até configurar banco, privacidade e grupo.

A rota POST /api/leads valida os campos, registra consentimentos e UTMs e só confirma após sucesso da inserção. Cada novo envio cria um registro; não há deduplicação automática. Dados inválidos não são gravados. Falhas não expõem mensagens do banco nem limpam o formulário. Prazo de 10s no envio; em timeout confira o banco antes de repetir, pois uma inserção pode ter sido concluída.

## Testar e publicar
`npm test` e `npm run build`. Testes de banco usam fetch simulado, não comprovam conexão real. Ainda é necessário criar o projeto Supabase, executar a migração, configurar variáveis e testar um cadastro fictício. Configure limitação de requisições na infraestrutura antes de tráfego pago. Integração local do Meta Pixel 2168410580211263 preparada com consentimento separado; validação na conta Meta e publicação pendentes. Consulte ENTREGA-OLIVER.md para limites de medição e evidências. Calendário provisório; prêmios e contador aguardam confirmação.

## Git e backup
Versione código, migrações SQL e package-lock.json. Nunca envie .env.local ou exportações de leads ao GitHub. O histórico de código não é backup do banco: configure uma política de backups no Supabase compatível com o plano da empresa. Não houve deploy no domínio ou conexão com contas externas. O histórico Git local está incluído no bundle do ZIP.
