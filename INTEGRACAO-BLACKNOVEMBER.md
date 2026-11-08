# Integração independente da Black November

Este PR pertence ao repositório da campanha, não ao aplicativo oficial WOA-Talk/woatalk. Nenhum arquivo do aplicativo oficial foi inspecionado ou alterado. Não fazer merge ou publicar a integração oficial sem revisão do Oliver.

## Limites da campanha

- Páginas: `/blacknovember`, `/blacknovember/confirmacao` e `/blacknovember/politica-de-privacidade`.
- Endpoint exclusivo: `POST /blacknovember/api/leads`.
- Estilos: CSS Module no layout da campanha, com seletores limitados ao contêiner local. Nenhuma regra em `html`, `body` ou `:root` do aplicativo.
- Metadados e canonical: somente na página `/blacknovember`. Confirmação permanece com `noindex`.
- Sem middleware, autenticação, providers, tabelas novas, migrações ou alterações na API existente do aplicativo.
- Os caminhos antigos `/black-november`, `/black-november/confirmacao`, `/politica-de-privacidade` e `/api/leads` deixam de ser oferecidos por este projeto independente.

## Como levar ao aplicativo oficial

1. Copiar **somente** `src/app/blacknovember/` para a árvore `app` correspondente do aplicativo. Se já existir essa pasta, comparar antes de substituir.
2. Neste repositório, executar `node scripts/prepare-blacknovember-assets.mjs`. Copiar somente a pasta gerada `public/blacknovember/` para `public/blacknovember/` do aplicativo oficial. Ela contém imagens e fonte em um namespace exclusivo.
3. NÃO copiar `src/app/page.tsx`, `src/app/layout.tsx`, `.gitignore`, `package.json`, `vercel.json`, workflows ou configurações de build deste projeto sobre os arquivos oficiais. Os arquivos raiz daqui são apenas o scaffold do preview independente; `/` retorna 404 aqui e não redireciona para a campanha. Preservar integralmente a home, metadados globais e canonical existentes do site oficial.
4. A API da campanha lê `SUPABASE_URL` e `SUPABASE_SECRET_KEY` no servidor. No destino, confirmar que apontam para o projeto WOA `ypiobypuqqsbyevdypel`. Não sobrescrever variáveis usadas por outra integração: se forem diferentes, criar variáveis exclusivas para a campanha e ajustar apenas o handler da campanha antes da publicação.
5. Preservar o controle de origem do endpoint; ao servir por proxy, validar o host público permitido. Não liberar CORS globalmente nem modificar a autenticação para viabilizar o formulário.
6. Se existir middleware global protegendo todas as rotas, Oliver deve avaliar a exceção limitada à campanha. Este PR não altera middleware nem autorização existentes.

Alternativa: manter este projeto separado e configurar no site oficial um rewrite limitado a `/blacknovember/:path*`. A regra deve incluir também as páginas, `/blacknovember/api/leads`, imagens e fontes, além dos assets Next.js com prefixo próprio se usar multi-zones. Não usar uma regra global para `/:path*`, `/api/:path*` ou `/_next/:path*` que substitua rotas do aplicativo.

## Antes de aprovar

- Executar testes e build, abrir o Deploy Preview e verificar desktop e celular.
- Testar cadastro válido e erro de validação, conferir o registro no Supabase WOA e a confirmação dentro de `/blacknovember/confirmacao`.
- Verificar política de privacidade e convite WhatsApp.
- No preview do aplicativo oficial, comparar home, login, sessão, páginas internas e APIs anteriores com a versão atual. Conferir title/canonical fora da campanha.
- A rota de confirmação é informativa, sem dados pessoais. Não usa sessão do aplicativo.

## Acesso ao preview do Netlify

Liberação de acesso é configuração da conta Netlify; não pode ser feita por commit. Em Project configuration → General → Visitor access, editar Project visibility/Password Protection e liberar o acesso aos previews. Não publicar repositório privado nem expor chaves para isso. Confirmar abertura do link `/blacknovember` em janela sem login. Enquanto houver Team protection, o teste público está bloqueado.
