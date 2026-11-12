# WOA Exclusive — Black November 2026

Landing page independente em Next.js App Router, React e TypeScript. Desenvolvimento exclusivo em `aliceagcs2062-beep/woa-exclusive-superaulas`, branch `desenvolvimento/superaulas`. Nenhum deploy, domínio, proxy ou infraestrutura foi configurado. `main` permanece intacta.

Para visualizar sem publicar, siga [o passo a passo de revisão local](VISUALIZAR.md). Para o formulário e as permissões do banco, consulte [a integração Supabase](SUPABASE.md).

## Desenvolvimento

Node.js 22.13+ ou 24 LTS e npm.

```sh
npm ci
npm run dev
```

Abra `http://localhost:3000`. Para validar:

```sh
npm test
npm run typecheck
npm run build
npm start
```

## Integração futura na subrota

Por padrão, a aplicação atende na raiz. Para o endereço planejado, definir antes do build:

```sh
NEXT_PUBLIC_BASE_PATH=/BlackNovember/superaulas npm run build
NEXT_PUBLIC_BASE_PATH=/BlackNovember/superaulas npm start
```

O Next aplica o prefixo a rotas e bundles; `assetPath`/`pdfPath` aplicam o mesmo prefixo aos arquivos públicos. Não configurar `assetPrefix`: ele não é necessário para subrota. Alterar o prefixo exige um novo build. A infraestrutura futura precisará encaminhar essa subrota (incluindo `_next` e arquivos) ao projeto independente. Isso não foi implementado e não requer alterações no repositório de lançamentos nesta entrega.

## Conteúdo e integrações

`lib/campaign.ts` concentra os dados tipados. Os 12 valores, quatro lotes, cinco benefícios, idiomas e textos das aulas vêm da referência. Os textos comerciais, valores, datas, condições, 12 links Asaas e contato foram fornecidos pelo usuário. Não foram recalculados juros ou parcelas.

- `lessons[].youtubeId`: ID oficial de 11 caracteres. Vídeo só carrega depois do clique, via `youtube-nocookie.com`. A Aula 01 usa `HG7y8aPbSrM`, fornecido pelo usuário. As aulas 02 a 04 aguardam gravação.
- `lessons[].pdf`: caminho real em `public/` ou URL HTTPS aprovada. PDFs locais usam `download` e base path. Downloads externos dependem também do `Content-Disposition` do servidor remoto.
- `integrations.checkout`: 12 URLs oficiais, uma por chave `{plano}-lote-{n}`; planos `3-meses`, `6-meses` e `1-ano`, lotes de 1 a 4. Somente HTTPS sem credenciais é aceito.
- `integrations.whatsapp`: número oficial com DDI/DDD, apenas dígitos. A página não envia mensagens automaticamente.
- `integrations.pixUrl`: link Asaas oficial para Pix com valor informado pelo cliente. Não é necessária chave Pix na aplicação. Não existe processamento nem confirmação automática de pagamento. A equipe precisa conferir o comprovante antes de confirmar a matrícula.
- `integrations.assets` e `lessons[].image`: caminhos locais das artes aprovadas. Consulte `public/images/README.md`.

Sem valores reais, os controles ficam desabilitados e identificados. Não há links fictícios. A tabela mostra os quatro lotes para comparação e habilita somente o vigente em novembro de 2026, em `America/Sao_Paulo`. A data é obtida no navegador após hidratação e atualizada a cada segundo e ao retomar a aba; até a primeira leitura, botões aguardam verificação. Datas inicial e final são inclusivas. Fora do período, cartão e Pix ficam indisponíveis; WhatsApp permanece acessível. Essa regra de interface usa o relógio do dispositivo, não substitui configuração de validade/preços no Asaas e não garante valores de checkout externos.

## Componentes e acessibilidade

`LessonCard`, `PricingTable`, `SectionHeading` e `Enrollment` são reutilizáveis. O player, os componentes de matrícula e o formulário de interessados usam estado no cliente. A rota `/api/leads` insere no Supabase usando chave publicável e RLS; a página verifica no servidor se as variáveis estão disponíveis. Fontes são servidas localmente; Next Image está preparado para otimização de artes. Não há analytics ou chamadas ao YouTube no carregamento inicial.

Há link para pular ao conteúdo, estrutura semântica, rótulos de controles, foco visível, suporte a movimento reduzido e tabela com cabeçalhos associados. No celular, cards ficam em uma coluna e a tabela permite rolagem horizontal com teclado. CSS cobre telas pequenas, intermediárias e grandes; inspeção visual em navegador ainda pendente nesta sessão.

## Pendências antes da publicação

1. Receber vídeos 02 a 04. Os quatro PDFs e o vídeo 01 estão integrados.
2. Conferir no Asaas os destinos, preços, parcelamento e validade dos links antes da publicação; nenhuma transação foi realizada nesta sessão.
3. Validar visualmente desktop/mobile com as artes reais, navegação por teclado e contraste; testar integrações oficiais ponta a ponta.
4. Aprovar integração de hospedagem separadamente. Remover `robots: noindex` e faixa de prévia somente após aprovação.

## Testes

Testes Node + TSX, renderização React e interação em JSDOM: conteúdo e preços, links indisponíveis, segurança de URLs, carregamento de vídeo por clique, PDFs independentes, checkout de cada plano/lote, contato/Pix, fronteiras de datas em Brasília, virada de lote com página aberta e prefixo. URLs e números de teste estão restritos às fixtures. JSDOM não substitui navegador para layout, contraste ou reprodução efetiva do YouTube.
