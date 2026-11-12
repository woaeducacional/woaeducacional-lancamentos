# Como visualizar sem publicar

Nenhuma etapa abaixo modifica o domínio woatalk.com.br ou publica a aplicação. A revisão acontece no seu computador. Os links externos do Asaas são reais: confira a tela e os valores, sem preencher dados de pagamento nem finalizar cobrança. WhatsApp abre uma conversa; não envia mensagem automaticamente.

## Opção simples, sem Git

1. Instale o **Node.js 24 LTS** pelo site oficial https://nodejs.org/ e reinicie o terminal após instalar.
2. Entre no GitHub com a conta que tem acesso ao repositório privado e abra:
   https://github.com/aliceagcs2062-beep/woa-exclusive-superaulas/tree/desenvolvimento/superaulas
3. Confira que a branch selecionada é `desenvolvimento/superaulas`. Clique em **Code → Download ZIP**.
4. Extraia o ZIP. Abra a pasta que contém `package.json` no VS Code e use **Terminal → Novo terminal**. No Windows, também pode clicar com o botão direito na pasta e escolher **Abrir no Terminal**.
5. Execute os comandos, um de cada vez:

```sh
npm ci
npm run dev
```

6. Mantenha esse terminal aberto e acesse **http://localhost:3000** no navegador. Se a porta estiver ocupada, use o endereço indicado no terminal.
7. Para encerrar a visualização, pressione **Ctrl+C** no terminal.

Se o PowerShell bloquear `npm.ps1`, use `npm.cmd ci` e `npm.cmd run dev`, ou abra o Prompt de Comando. Não é preciso alterar a política de execução do sistema.

## Se preferir usar Git

```sh
git clone --branch desenvolvimento/superaulas --single-branch https://github.com/aliceagcs2062-beep/woa-exclusive-superaulas.git
cd woa-exclusive-superaulas
npm ci
npm run dev
```

O repositório é privado; o Git pode solicitar autenticação. Não coloque tokens no código ou na URL. Se já houver uma cópia local com alterações, preserve-as antes de atualizar; o ZIP em uma pasta nova é a opção mais simples para revisão.

## Teste no celular

No Chrome/Edge do computador, abra as ferramentas do desenvolvedor (F12 ou menu → Mais ferramentas → Ferramentas do desenvolvedor). Ative o ícone de celular/tablet e teste larguras de 360, 390 e 768 px. No desktop, teste também 1280 px.

Para usar um celular real, conecte os dois aparelhos à mesma rede Wi-Fi. Com o servidor aberto, acesse no celular `http://IP-DO-COMPUTADOR:3000`, substituindo pelo IPv4 local mostrado pelo comando `ipconfig` no Windows ou pelas configurações de rede do macOS. `localhost` no celular aponta para o próprio celular. Se o sistema solicitar, permita o Node apenas na rede privada. Redes que isolam dispositivos podem bloquear esse acesso; não abra portas no roteador.

## O que conferir

- Logo transparente, experiência de 15 anos e águia ampliada à direita no desktop; no celular, centralizada abaixo do texto, com a galáxia ao fundo.
- Aula 01 reproduz o vídeo após clicar; PDFs 01 a 04 baixam arquivos distintos. Os vídeos 02 a 04 ainda não foram enviados.
- Três planos, quatro lotes e rolagem horizontal da tabela no celular, sem deslocar a página inteira.
- Na data de 10/11/2026 em Brasília, apenas os três botões do lote 2 ficam ativos. Lotes futuros e encerrados continuam identificados. O relógio do dispositivo deve estar correto.
- Os cinco benefícios, o título “IDIOMAS DISPONÍVEIS” e as cinco bandeiras.
- Botão Pix amarelo, instrução de valor à vista exato, botão WhatsApp verde, telefone e frase completa do rodapé.
- Tab navega pelos controles, o foco é visível e o link “Pular para o conteúdo” funciona.

Pendência externa identificada: o link Asaas de **3 meses / lote 3** retornou HTTP 500 em duas consultas. Conferir no painel Asaas antes da abertura desse lote. Os demais 11 links de planos e o Pix responderam HTTP 200; as 12 parcelas dos 11 planos acessíveis conferem com a página. Nenhuma cobrança foi realizada.

## Repetir validações e testar o build local

Pare o servidor com Ctrl+C e execute:

```sh
npm test
npm run typecheck
npm run build
npm start
```

Abra novamente http://localhost:3000. `build` compila e `start` serve essa versão localmente: isso não faz deploy de produção.

## Conferir a subrota planejada (opcional)

Crie `.env.local` na mesma pasta de `package.json`, com:

```dotenv
NEXT_PUBLIC_BASE_PATH=/BlackNovember/superaulas
```

Reinicie `npm run dev` e acesse http://localhost:3000/BlackNovember/superaulas. Para testar o build nessa configuração, execute novamente `npm run build` e `npm start`. Para voltar à raiz, remova essa linha e reinicie/recompile. Esse procedimento não modifica nenhuma infraestrutura.
