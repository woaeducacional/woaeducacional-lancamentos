# Entrega da Black November

URL oficial e canonical da campanha: https://woatalk.com.br/blacknovember

Use esta branch como entrega da aplicação independente. A campanha já contém a página, confirmação, API de leads, estilos e imagens. O site oficial conserva seu projeto e seu domínio. A publicação cabe ao Oliver.

## Configuração da campanha

- Execute `npm ci`, `npm test` e `npm run build`. O prebuild prepara imagens e fontes em `/blacknovember/`.
- Configure `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_WHATSAPP_GROUP_URL` e `NEXT_PUBLIC_PRIVACY_URL` no projeto da campanha. Confira os demais campos em `.env.example`. Use o Supabase de teste no Preview. Confirme que a tabela `black_november_leads` existe no banco escolhido antes de executar qualquer migração.
- Configure `BLACK_NOVEMBER_ALLOWED_ORIGINS=https://woatalk.com.br` no ambiente de produção da campanha. No ambiente de teste, use a origem exata do Preview do site oficial. Separe múltiplas origens por vírgula. Esse valor contém apenas protocolo e domínio, sem caminho.
- O formulário envia POST para `/blacknovember/api/leads`. A confirmação está em `/blacknovember/confirmacao`.

## Integração no projeto oficial

Revise primeiro as regras existentes para `/blacknovember` e `/black-november`. Em uma branch do projeto oficial, encaminhe o caminho da campanha e seus subcaminhos à origem da aplicação independente. Exemplo de entradas para mesclar em `rewrites` no `vercel.json` oficial, trocando o destino por uma origem de teste autorizada no Preview:

```json
[
  {
    "source": "/blacknovember",
    "destination": "https://woa-black-november.vercel.app/blacknovember"
  },
  {
    "source": "/blacknovember/:path*",
    "destination": "https://woa-black-november.vercel.app/blacknovember/:path*"
  }
]
```

A origem de Preview precisa aceitar requisições do projeto oficial. Confira a aba Network para imagens, fontes e recursos gerados pelo Next.js, em especial `/_next/`. As regras acima só cobrem o prefixo da campanha. Se os recursos do Next.js estiverem sendo resolvidos pelo site oficial, configure um prefixo de assets exclusivo da campanha ou a integração de microfrontends antes de publicar. Preserve os caminhos globais do site oficial.

## Validação e publicação

1. Em Preview, teste a página e a confirmação em celular e desktop. Confirme que a URL permanece no host do site oficial e que imagens, fontes e scripts carregam.
2. Envie um cadastro fictício com UTM para o Supabase de teste. Verifique o registro, a confirmação e o botão do WhatsApp. Confira também privacidade, home, login e as demais rotas oficiais.
3. Com o Preview aprovado, Oliver publica a configuração no projeto que atende `woatalk.com.br` e valida a URL oficial. Preserve o link da campanha já divulgado durante a transição.

Esta entrega prepara o código e a configuração de referência. O encaminhamento no projeto oficial e os testes de ponta a ponta dependem do Preview desse projeto.

## Revisão local — 7 de novembro de 2026

Entrega preparada para revisão do Oliver, sem push, deploy, alteração de DNS ou acesso ao Supabase real. Nenhum arquivo está no stage.

### Arquivos da entrega

- `src/app/blacknovember/page.tsx`: alteração local preexistente preservada; canonical `https://woatalk.com.br/blacknovember`, sem mudança nos componentes ou na oferta.
- `ENTREGA-OLIVER.md`: domínio oficial, origem permitida e este registro de revisão.
- `GUIA-COMPLETO.md`: referências ao domínio e exemplo de canonical corrigidos para `.com.br/blacknovember`.
- `tests/isolation.test.mjs`: verificação do canonical e da home independente, que continua retornando 404 sem importar ou redirecionar para a campanha.
- `tests/leads.test.mjs`: origens `.com.br` e `www` nos testes; domínio antigo rejeitado quando não autorizado.
- `next-env.d.ts`: arquivo gerado pelo Next.js, já não rastreado antes dos ajustes; preservado, sem credenciais. Não integra o diff dos arquivos rastreados.

`src/app/page.tsx`, estilos, imagens, oferta, API e migrações não foram alterados nesta entrega.

### Verificações executadas

- `npm.cmd test`: 5 testes aprovados, nenhuma falha, após os ajustes finais dos testes.
- `npm.cmd run build`: sucesso, incluindo TypeScript e geração das páginas.
- `git diff --check`: sem erros de whitespace; Git emitiu avisos de conversão LF/CRLF.
- O sufixo `.cmd` foi necessário porque a política do PowerShell bloqueia `npm.ps1`.
- Avisos não bloqueantes: tipo de módulo não declarado no teste da API e `package-lock.json` externo ao repositório ignorado pelo Next.js.
- Os testes usam fetch simulado; os logs de falhas de armazenamento são cenários esperados. Não comprovam conexão com o Supabase real. Não houve validação visual em navegador nesta rodada.

### Credenciais

Revisados o diff, os arquivos candidatos à entrega e padrões comuns de segredos nos arquivos versionados e não rastreados não ignorados. Nenhuma credencial real identificada. As ocorrências são placeholders de documentação e `sb_secret_test_only` dos testes. Somente `.env.example` está versionado, com campos de credenciais vazios; `.env.local` e `.env.production` são ignorados. Esta verificação não é uma auditoria do histórico Git.

### Pendências para Oliver antes da publicação

- Domínio: confirmar o projeto que atende `woatalk.com.br`, revisar encaminhamento limitado à campanha e validar recursos Next.js, imagens, fontes, canonical e preservação das rotas oficiais no Preview. A origem de destino nos exemplos é referência, não uma publicação verificada.
- Origens: configurar `BLACK_NOVEMBER_ALLOWED_ORIGINS=https://woatalk.com.br` no ambiente correto; incluir `https://www.woatalk.com.br` apenas se também for usado. Validar separadamente a origem exata do Preview.
- Supabase: confirmar o projeto correto, a existência da tabela e as permissões; configurar `SUPABASE_URL` e `SUPABASE_SECRET_KEY` somente no servidor, sem sobrescrever integrações existentes. Revisar a necessidade de migração antes de executá-la.
- Cadastro: testar em ambiente autorizado com Supabase de teste, conferir consentimentos e UTMs, confirmação, erros de validação e botão do WhatsApp.
- Links: configurar e verificar WhatsApp e privacidade. O `.env.example` ainda contém `/politica-de-privacidade`; para esta campanha, usar `/blacknovember/politica-de-privacidade`. O guia completo também contém exemplos históricos; a árvore atual e `INTEGRACAO-BLACKNOVEMBER.md` orientam o isolamento da campanha.
- Publicação condicionada à revisão do Oliver; nenhuma dessas ações externas foi executada.

## Integração local do Meta Pixel — 7 de novembro de 2026

Branch: `alice/ajuste-dominio-woatalk`, sobre o commit `74f452b`. Pixel oficial confirmado pelo usuário: `2168410580211263`. Integração preparada para commit e revisão em PR em rascunho; merge e deploy não estão autorizados.

### Comportamento preparado

- Carrega `fbevents.js` somente após aceite explícito de publicidade, separado dos consentimentos de comunicação e ofertas. Permite recusar, revisar e revogar; a preferência é guardada em `woa-ad-consent-v1`.
- Inicializa somente o ID oficial, com `autoConfig=false`, navegação automática desativada e sem argumento de dados de usuário. Usa `trackSingle` para PageView e Lead, com parâmetros vazios.
- PageView é deduplicado por caminho em cada documento. Uma nova navegação de volta a um caminho gera uma visita; atualizar o documento gera uma nova visita, nunca um novo Lead.
- Lead é chamado apenas no formulário após resposta HTTP bem-sucedida e JSON `{ ok: true }`. A API existente só responde assim após o armazenamento aceitar a inserção. Há proteção contra submissões simultâneas. A confirmação não contém disparo de Lead.
- Falhas do Pixel não bloqueiam cadastro salvo; o carregamento do SDK tem espera máxima de 1,8 segundo no fluxo do Lead. Eventos anteriores ao consentimento ou perdidos por bloqueio do SDK não são reproduzidos depois.
- Nenhum campo do formulário é passado à Meta. Não há GTM no código. Se for detectado outro Pixel ou GTM, esta integração não instala outro Pixel.


## Revisão da proteção de URLs de campanha

Esta revisão substitui o bloqueio geral de queries da primeira versão. A medição de acessos de campanha é permitida após consentimento, usando um novo documento com URL limpa.

### Como a atribuição foi preservada

- Antes de carregar qualquer código da Meta, a aplicação captura somente `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term`, mantendo o limite existente de 200 caracteres por valor.
- Esses valores ficam separados em `sessionStorage` por aba, na chave `woa-campaign-attribution-v1`; o snapshot só é reutilizado por até 30 minutos em novos documentos. O formulário passa a ler essa atribuição, inclusive após a limpeza da URL e com publicidade recusada.
- Queries, inclusive `fbclid`, e fragmentos desconhecidos são removidos por navegação com `location.replace` para o mesmo caminho. O histórico não ganha uma entrada extra. Âncoras conhecidas (`#oferta`, `#inscricao`, `#beneficios`) continuam aceitas.
- O layout envia a política `no-referrer`. Qualquer referrer não vazio também exige novo documento, inclusive para evitar identificadores em hostnames ou caminhos aparentemente simples. Isso limpa `document.referrer`, além de `location`, `documentURI` e da URL de navigation timing; não é apenas um filtro nos argumentos de `fbq`.
- A normalização acontece antes da interação com o formulário e independe da escolha de publicidade. Se a sessão não puder preservar UTMs ou a política de referrer não estiver presente, o Pixel permanece bloqueado nesse documento; o formulário continua capturando as UTMs em memória.
- O envio do formulário não provoca essa navegação: o controlador do Pixel apenas verifica se o documento é seguro. Somente o sucesso confirmado pela API pode produzir Lead.
- Nenhuma UTM, parâmetro arbitrário, fragmento ou dado do formulário é passado à Meta pela integração. `fbclid` não é repassado; não se preserva a atribuição por esse identificador. Nenhuma modificação em DNS, Supabase ou contas Meta foi feita.

### Evidências anteriores do SDK real (não repetidas no fechamento)

O teste `.git/pixel-qa/query-vendor.cjs` carregou o SDK e a configuração pública reais de `connect.facebook.net`. Todas as requisições de eventos foram atendidas localmente pelo interceptador, sem entrega à Meta. A API também foi simulada.

A entrada continha cinco UTMs, nome, e-mail e telefone fictícios, parâmetro arbitrário, `fbclid` e fragmento. Uma das próprias UTMs continha um e-mail fictício. O referrer inicial também continha um e-mail fictício. A limpeza ocorreu antes do carregamento do SDK, e nenhum desses marcadores foi encontrado nas URLs, corpos ou cabeçalhos das requisições da Meta, inclusive após preenchimento e envio do formulário.

| Pedido observado | Campo automático | Valor no teste |
| --- | --- | --- |
| SDK e configuração em `connect.facebook.net` | Cabeçalho `Referer` | Ausente |
| `www.facebook.com/tr/` — PageView | `dl` | `http://localhost:3100/blacknovember` |
| `www.facebook.com/tr/` — Lead | `dl` | `http://localhost:3100/blacknovember` |
| `www.facebook.com/tr/` — confirmação | `dl` | `http://localhost:3100/blacknovember/confirmacao` |
| Todos os eventos | `rl` | Vazio |
| Todos os eventos | `ud[...]` de correspondência avançada | Ausente |

Foram observados três PageViews em documentos distintos (campanha, confirmação e atualização da confirmação) e um único Lead. Os eventos usaram `2168410580211263`. O estado do SDK mostrou `userData: {}`. As cinco UTMs chegaram intactas ao corpo da API simulada, sem as demais chaves da query.

O primeiro contexto headless, com identificação de automação, não produziu pedidos de eventos apesar de executar `fbq`. A configuração pública contém o plugin BotBlocking. Para observar a serialização real, a rodada de QA usou user-agent comum e `navigator.webdriver=false`; isso é configuração do teste, não alteração do código da aplicação ou da conta Meta. Os relatórios registram essa limitação: não comprovam comportamento em todos os navegadores nem recebimento no Gerenciador de Eventos.

### Resultado da rodada atual

- **Aprovado:** 16 testes automatizados; 10 cenários funcionais no Edge; inspeção de pedidos do SDK real; build; `git diff --check`.
- **Aprovado:** aceite/recusa/revogação; UTMs preservadas com aceite e recusa; query adicionada por navegação normalizada; PageView sem duplicação; Lead somente após sucesso; nenhum Lead em erros, submissão dupla, acesso direto ou atualização da confirmação.
- **Falhou:** nenhum cenário final da aplicação. Limite da primeira inspeção: bloquear a configuração validava apenas chamadas a `fbq`; as evidências anteriores de `/tr/` complementaram essa verificação, sem comprovar recebimento na conta.
- **Não testado:** gravação em Supabase de teste autorizado; recebimento no Gerenciador de Eventos; integração com outras tags do site oficial. Permanecem pendentes até haver ambiente e acesso autorizados.

Evidências: `.git/pixel-qa/query-vendor-results.json` (pedidos completos, campos automáticos, corpo fictício da API e estado do SDK) e `.git/pixel-qa/browser-results.json` (10 cenários). Esses artefatos são locais, fora do commit. As strings de dados pessoais nesses arquivos são exclusivamente dados fictícios de QA.


## Fechamento para revisão do Oliver

Ajuste de URLs e testes locais concluídos. No fechamento, `npm.cmd test` foi repetido: 16 aprovados, nenhuma falha; `git diff --check` sem erros. O build aprovado e os 10 cenários locais no Edge da rodada anterior continuam válidos: depois deles, somente a documentação foi ajustada.

Não houve acesso à conta da Meta nem novas consultas externas neste fechamento. Os registros do SDK público acima são evidências de rodadas anteriores, não validação no Gerenciador de Eventos. A validação na Meta fica exclusivamente sob responsabilidade do Oliver; não executar os scripts de inspeção externa para este fechamento.

Pendências para revisão:

- Oliver: verificar recebimento e deduplicação no Gerenciador de Eventos, configurações do Pixel oficial e eventual instalação paralela no site/GTM.
- Em ambiente autorizado de teste: validar cadastro e conferir a linha gravada no Supabase. Nenhum banco de produção foi usado; os testes locais usam respostas simuladas.
- Revisar consentimento, política de privacidade e a navegação para URL limpa, que preserva as cinco UTMs para o formulário, mas descarta `fbclid` e parâmetros arbitrários para medição.
- Conferir domínio, origens permitidas e carregamento de assets no ambiente de integração, conforme as pendências anteriores.

A integração foi preparada para revisão na branch `alice/ajuste-dominio-woatalk`. `next-env.d.ts` permanece não rastreado e fora da entrega. A pasta original foi preservada. No fechamento dos testes não houve push, merge, deploy, alteração de DNS ou de Supabase. O envio posterior da branch e a abertura de PR em rascunho foram autorizados pelo usuário; Oliver fica responsável pela validação na Meta antes de publicar.
