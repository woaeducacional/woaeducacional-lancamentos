# Entrega para revisão

## Escopo realizado

Aplicação Next.js 16.4.6, React e TypeScript, componentes reutilizáveis, quatro aulas, tabela com 12 opções, cinco benefícios, cinco idiomas e seção de confirmação Pix/WhatsApp. Layout CSS adaptativo azul/amarelo/branco; artes originais do ZIP Visual WOA incorporadas em WebP. Nenhuma integração fictícia e nenhuma matrícula é confirmada automaticamente.

## Validação executada

- `npm test`: 17/17 testes aprovados.
- `NEXT_PUBLIC_BASE_PATH=/BlackNovember/superaulas npm test`: 17/17 aprovados.
- `npm run typecheck`: aprovado.
- `npm run build`: aprovado na raiz.
- `NEXT_PUBLIC_BASE_PATH=/BlackNovember/superaulas npm run build`: aprovado.
- Artefato gerado inspecionado: manifest com basePath correto, bundles prefixados e nenhum iframe YouTube inicial.
- `git diff --check`: aprovado.

Os testes de configuração usam fixtures isoladas; nenhuma URL de exemplo está nos dados da campanha. Testes de interação executados em JSDOM, não em navegador real.

## Limitações

Artes de oceano, galáxias e águias incorporadas a partir de Visual WOA.zip. Seis WebPs totalizam 222.728 bytes. Logo sem fundo aprovada pelo usuário incorporada ao cabeçalho e rodapé, em WebP 420 × 336 com canal alfa. Os quatro PDFs foram conferidos por tema e preservados byte a byte (SHA-256). A Aula 01 usa HG7y8aPbSrM, fornecido pelo usuário. A reprodução real e a permissão de incorporação do YouTube ainda precisam ser verificadas em navegador.

A ferramenta `cua_repl.js` não está disponível. A [orientação de Sites](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) exige: “If `cua_repl.js` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Por isso, inspeção responsiva real, contraste visual e screenshots não foram executados. A revisão de acessibilidade é estrutural, sem certificação por auditoria em navegador.

## Pendências de conteúdo

Vídeos oficiais das aulas 02 a 04. Os textos comerciais, preços, 12 links Asaas, Pix e WhatsApp de Oliver foram integrados conforme enviados. Para plano anual/lote 1, foi usado o endereço visível `kmzr22udf41fn6rb`, ignorando o hiperlink vazio anterior. Validar destinos, valores e disponibilidade no Asaas antes da publicação; não houve transação nem confirmação automática.

A interface libera apenas o lote vigente (Brasília), com datas inclusivas e atualização enquanto a página permanece aberta. Fora de novembro de 2026, cartão/Pix ficam indisponíveis e WhatsApp continua acessível. O relógio do dispositivo orienta a interface: regras financeiras e validade também devem estar configuradas no provedor.

## Isolamento

Somente `aliceagcs2062-beep/woa-exclusive-superaulas`, branch `desenvolvimento/superaulas`. Não houve acesso ou alteração ao repositório de lançamentos, alteração de main, configuração de deploy, publicação ou mudança na infraestrutura. A URL planejada é apenas destino futuro.

## Ajustes finais e conferência externa — 10/11/2026

Águia astronauta ampliada à direita: até 420 px de largura no desktop e até 300 px centralizada abaixo do texto no celular, proporção 3:4. Incluídos o título “IDIOMAS DISPONÍVEIS” e a frase completa “WOA TALK — Sua jornada para destravar a conversação!”. Valores à vista explicitamente identificados como Pix.

Consulta HTTP somente leitura aos 12 links de planos e ao Pix, sem envio de formulário ou pagamento:

- 11 links de planos responderam HTTP 200. Os títulos identificam plano/lote corretos e as opções de 12 parcelas correspondem aos valores da página.
- Plano de 3 meses / lote 3 (`ox79a8c925o17s7tv`): HTTP 500 em duas tentativas. Preservado o endereço fornecido; requer conferência no Asaas. Não se conclui que o link esteja permanentemente indisponível.
- Pix (`zdi9uwkmtojxpfeb`): HTTP 200, página “PAGAMENTO VIA PIX À VISTA”. O cliente informa o valor; o preço com desconto não pode ser validado como valor fixo desse link.
- A opção “à vista” dentro dos checkouts de cartão corresponde ao total do cartão, não ao desconto Pix. A interface agora explicita “À vista via Pix” para evitar confusão.

A conferência HTTP não substitui o teste interativo em navegador nem comprova conclusão de pagamento. Consulte `VISUALIZAR.md` para a revisão local, sem deploy.

## Nova referência para a abertura

Cabeçalho com logo ampliada à esquerda e BLACK / NOVEMBER em faixa ciano à direita, com WOA TALK / 2026. Abertura sobre oceano mais visível, com CONVERSAÇÃO em faixa amarela; texto e arte lado a lado a partir de 960 px e composição centralizada em telas menores. Mantidos WOA EXCLUSIVE e a experiência de 15 anos. O usuário confirmou usar apenas o visual da referência: nenhuma oferta de 30 dias grátis foi incluída. Componentes adaptados para telas pequenas; inspeção visual no navegador continua pendente.

## Águia com aparência 3D

A abertura usa `eagle-3d.webp`, nova arte de personagem isolado com canal alfa, iluminação ciano e sombra CSS discreta. Mantida a posição à direita no desktop e preservada a arte original no card da Aula 04. Imagem estática, sem biblioteca 3D ou aumento de JavaScript.

A pedido do usuário, a galáxia original voltou à abertura como uma camada atrás da águia 3D, com bordas suaves e área visível ao redor do personagem. O fundo transparente do personagem permite enxergar a galáxia sem recriar a imagem retangular anterior.

## Prioridade ao celular

Abertura sem altura mínima artificial, águia e galáxia ampliadas, tipografia principal fluida, textos de apoio de 18 px no celular e 21 px no desktop, botões principais com pelo menos 50 px de altura e espaçamentos reduzidos. Textos dos cards, benefícios e idiomas ampliados. Mantidos os links, preços e funcionamento dos lotes. Testes existentes e build aprovados; revisão visual em dispositivos reais ainda depende da prévia local.

## Formulário Supabase

Cadastro público sem login implementado com consentimento obrigatório, nome/e-mail/WhatsApp e API de INSERT apenas. Credenciais válidas ativam o envio por padrão. O usuário autorizou teste com seus próprios dados no banco real, preservando registros existentes. Não houve gravação real: o `.env.local` e o banco não estão acessíveis nesta sessão. Políticas SQL preparadas, não aplicadas. Vercel ainda sem configuração ou deploy; definição do projeto pendente. Ver `SUPABASE.md` para metadados, permissões, ativação e teste local.

## Pixel e privacidade

Pixel Meta 2168410580211263 integrado com consentimento opt-in para marketing, preferência local, recusa e revogação (consent revoke + recarregamento). Somente PageView; sem envio configurado dos campos do formulário. Página `/privacidade` respeita basePath e contém versão para revisão, com identificação jurídica, canal de privacidade e retenção ainda pendentes. Não equivale a auditoria/conformidade integral LGPD. Teste interativo de rede/Meta Pixel Helper ainda pendente. Nenhum deploy ou domínio alterado.
