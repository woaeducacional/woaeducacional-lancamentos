# Atualização visual V2 — aplicar à cópia no Windows

## Instalar sem apagar suas configurações

1. No PowerShell que está executando o site, pressione Ctrl+C.
2. Extraia o ZIP da atualização em outra pasta, não dentro do projeto.
3. Abra a pasta extraída. Copie somente a pasta `src` para dentro da pasta do projeto que contém `package.json`, mesclando pastas e substituindo os arquivos quando solicitado.
4. As imagens continuam em `public/images`. Não apague essa pasta e não substitua `.env.local`.
5. A integração atual usa Supabase. Se seu .env.local ainda tem apenas LEADS_WEBHOOK_URL, atualize as configurações conforme o guia: SUPABASE_URL e SUPABASE_SECRET_KEY, além dos links oficiais de política e grupo. Nunca envie esses valores ao GitHub.
6. Na pasta original do projeto, execute `npm run dev` e abra http://localhost:3000/black-november.
7. Pressione Ctrl+0 para conferir o layout com zoom 100%; depois Ctrl+Shift+R para atualizar. É uma conferência adicional, não substitui os ajustes do novo layout.
8. A confirmação pode ser visualizada em /black-november/confirmacao. Sem o link oficial configurado, ela informa que o grupo será disponibilizado em breve.

O pacote de atualização não inclui .env.local nem dados pessoais. O botão de inscrição continua desabilitado até configurar banco, política e grupo; o novo design não simula cadastros.

## Salvar no Git/GitHub

Execute na pasta original do projeto, depois de ter configurado o repositório:

```powershell
npm test
npm run build
git status
git diff
git add src
git diff --cached
git commit -m "Atualiza layout Black November para campanha V2"
git push
```

Se o seu projeto ainda não tem testes configurados no package.json, use o projeto completo atualizado e o guia para configurar. Se Git ainda não estiver inicializado ou não tiver origin, siga as etapas de configuração do guia antes do commit/push. Não use force push.

## O que mudou

- Oferta 30 dias grátis + 4 aulas ao vivo abre a campanha, centralizada.
- Formulário direto, sem cartão branco gigante, com campos compactos e CTA verde.
- Benefícios em dois grandes blocos ilustrados; extras em blocos menores.
- Passos com etiquetas destacadas, calendário compacto, opções de continuidade e FAQ.
- Confirmação branca com título destacado e chamada para o grupo.
- Fundos originais editados anteriormente, sem novas gerações de imagens.

Build Next.js e testes simulados da API passaram. A prévia automática não iniciou por incompatibilidade do serviço de prévia com os argumentos do Next.js; validação visual em navegador e celular ainda precisa ser concluída na sua cópia. O projeto não foi publicado no domínio e não foi enviado à sua conta GitHub.
