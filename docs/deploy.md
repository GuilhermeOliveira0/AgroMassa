# Deploy do AgroMassa

Guia objetivo para preparar o deploy do MVP em Vercel com Supabase PostgreSQL e Supabase Storage.

## 1. Supabase

Crie ou selecione um projeto Supabase.

Configure o banco PostgreSQL e guarde:

- connection string transacional para `DATABASE_URL`
- connection string direta para `DIRECT_URL`

Configure o Storage:

- crie o bucket `product-images`
- use exatamente o nome do bucket em `SUPABASE_STORAGE_BUCKET`
- mantenha a `service role key` apenas em variaveis server-side

Importante:

- `NEXT_PUBLIC_SUPABASE_URL` deve ser algo como `https://SEU-PROJETO.supabase.co`
- `NEXT_PUBLIC_SUPABASE_URL` nao deve conter `/rest/v1`
- `SUPABASE_SERVICE_ROLE_KEY` nunca deve ir para codigo, README com valor real, print publico ou client-side

## 2. Variaveis na Vercel

Cadastre as variaveis do `.env.example` no painel da Vercel, usando valores reais somente no painel de ambiente.

Obrigatorias:

```text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
AGROMASSA_WHATSAPP_DISPLAY
AGROMASSA_WHATSAPP_DIGITS
AGROMASSA_CITY
AGROMASSA_STATE
```

Para producao:

- `NEXTAUTH_URL` deve ser a URL publica final do site
- `AUTH_SECRET` e `NEXTAUTH_SECRET` devem ser fortes e secretos
- `ADMIN_PASSWORD` deve ser forte antes de rodar o seed

## 3. Banco e Prisma

Antes do primeiro uso em producao:

```bash
npx prisma validate
npm run prisma:generate
```

Aplique as migracoes conforme o fluxo escolhido para o ambiente. Em um deploy controlado, rode migracoes contra o banco de producao apenas depois de revisar o schema, confirmar o banco alvo e garantir backup ou plano de rollback.

Para ambiente remoto, prefira o fluxo de deploy:

```bash
npx prisma migrate deploy
```

Nao use `prisma migrate dev` contra staging ou producao.

Depois, rode o seed principal no ambiente correto:

```bash
npm run prisma:seed
```

O seed cria ou atualiza:

- administrador inicial
- configuracoes institucionais iniciais

## 4. Build

Valide localmente antes de publicar:

```bash
npx prisma validate
npm run typecheck
npm run lint
npm run build
```

Na Vercel, o comando de build esperado e:

```bash
npm run build
```

## 5. Checklist pos-deploy

Depois do deploy, validar:

- `/` carrega a home
- `/produtos` carrega o catalogo
- `/produtos/[slug]` abre um produto publico valido
- `/admin/login` abre o login
- login admin funciona
- `/admin` mostra dashboard
- `/admin/produtos` mostra produtos
- criar rascunho funciona
- publicar produto completo funciona
- upload de imagem funciona
- imagem principal aparece no catalogo e detalhe
- acoes rapidas funcionam
- arquivar/restaurar funciona
- remover por arquivamento com `ARQUIVAR` funciona
- `/admin/institucional` salva e reflete no publico
- CTAs de WhatsApp abrem com numero e mensagem corretos

## 6. Cuidados operacionais

- Nao versionar `.env`
- Nao compartilhar `SUPABASE_SERVICE_ROLE_KEY`
- Nao usar `NEXT_PUBLIC_SUPABASE_URL` com `/rest/v1`
- Usar `NEXT_PUBLIC_SUPABASE_URL` como URL base do projeto, por exemplo `https://SEU-PROJETO.supabase.co`
- Usar `SUPABASE_STORAGE_BUCKET` como nome simples do bucket, sem URL ou caminho
- Conferir se o bucket `product-images` existe antes de testar upload
- Trocar senha inicial se ela tiver sido compartilhada durante setup
- Manter backups do banco antes de mudancas de schema futuras

## 7. Fora do deploy atual

Estes itens devem virar tarefas proprias se forem priorizados:

- limpeza automatizada de arquivos orfaos no Storage
- upload assinado direto para Supabase
- pipeline automatizado de migracoes
- testes automatizados de ponta a ponta
