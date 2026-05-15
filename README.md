# AgroMassa

Site institucional e catalogo comercial para a AgroMassa, com area publica para consulta de tratores e implementos agricolas e painel administrativo para manter produtos, imagens e informacoes institucionais.

O sistema nao e um e-commerce. Nao ha carrinho, checkout ou pagamento online. A conversao principal acontece pelo WhatsApp.

## Stack

- Next.js com App Router
- React e TypeScript
- Tailwind CSS
- Prisma ORM
- Supabase PostgreSQL
- Supabase Storage
- Auth.js com Credentials Provider
- Zod para validacao

## Requisitos

- Node.js compativel com o projeto Next.js
- npm
- Banco PostgreSQL no Supabase
- Bucket `product-images` no Supabase Storage
- Arquivo `.env` local baseado em `.env.example`

## Configuracao do ambiente

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` local a partir do exemplo:

```bash
cp .env.example .env
```

3. Preencha as variaveis no `.env` local.

Importante:

- nunca commitar o `.env` real
- nunca expor `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` deve ser a URL base do projeto Supabase, como `https://SEU-PROJETO.supabase.co`
- `NEXT_PUBLIC_SUPABASE_URL` nao deve conter `/rest/v1`
- `SUPABASE_STORAGE_BUCKET` deve ser somente o nome do bucket, por exemplo `product-images`

## Variaveis de ambiente

Veja `.env.example` para a lista completa. As principais categorias sao:

- banco de dados: `DATABASE_URL`, `DIRECT_URL`
- autenticacao: `AUTH_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Supabase Storage: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
- seed do administrador: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- padroes publicos da empresa: `AGROMASSA_WHATSAPP_DISPLAY`, `AGROMASSA_WHATSAPP_DIGITS`, `AGROMASSA_CITY`, `AGROMASSA_STATE`

## Prisma

Validar o schema:

```bash
npx prisma validate
```

O projeto tambem possui o script equivalente:

```bash
npm run prisma:validate
```

Gerar cliente Prisma:

```bash
npm run prisma:generate
```

Rodar migracoes em desenvolvimento:

```bash
npm run prisma:migrate
```

Para deploy controlado em ambiente remoto, revise o banco alvo e use o fluxo de deploy de migrations:

```bash
npx prisma migrate deploy
```

Abrir Prisma Studio:

```bash
npm run prisma:studio
```

## Seed

Criar ou atualizar o administrador inicial e as configuracoes institucionais:

```bash
npm run prisma:seed
```

Popular dados de teste, depois do seed principal:

```bash
npm run prisma:seed:test
```

O seed principal usa `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Use credenciais fortes no `.env` real.

## Rodar localmente

Servidor de desenvolvimento:

```bash
npm run dev
```

Build de producao local:

```bash
npm run build
npm run start
```

Abrir:

- publico: `http://localhost:3000`
- catalogo: `http://localhost:3000/produtos`
- admin: `http://localhost:3000/admin/login`

## Gates de validacao

Antes de entregar alteracoes, rode:

```bash
npx prisma validate
npm run typecheck
npm run lint
npm run build
```

Scripts disponiveis no `package.json`:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run prisma:validate`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`
- `npm run prisma:seed:test`
- `npm run prisma:studio`

## Fluxo publico

- `/`: home institucional com marca, texto da empresa, servicos e contato
- `/produtos`: catalogo com busca, filtros e carregar mais
- `/produtos/[slug]`: detalhe do produto com galeria, informacoes e CTA de WhatsApp

Produtos publicos respeitam as regras de visibilidade:

- nao arquivado
- visivel no site
- status diferente de rascunho
- imagem principal definida
- campos obrigatorios de publicacao preenchidos

## Fluxo administrativo

- login em `/admin/login`
- dashboard com metricas operacionais em `/admin`
- listagem de produtos em `/admin/produtos`
- novo produto em `/admin/produtos/novo`
- edicao em `/admin/produtos/[id]`
- institucional em `/admin/institucional`

O admin consegue:

- criar rascunho
- publicar produto validado
- editar produto
- enviar imagem
- trocar imagem principal
- excluir imagem vinculada
- alterar status, visibilidade e destaque pela listagem
- arquivar e restaurar produto
- remover produto do sistema por arquivamento seguro, com confirmacao digitando `ARQUIVAR`
- atualizar informacoes institucionais

## Supabase Storage

O bucket `product-images` precisa existir antes do upload.

O upload:

- aceita JPG, PNG e WEBP
- limita cada imagem a 5 MB
- limita cada produto a 8 imagens
- usa o servidor da aplicacao para validar e enviar o arquivo
- grava metadados em `product_images`

Remover imagem no admin remove o vinculo/metadado no banco. A limpeza de arquivos orfaos no Storage deve ser tratada com cuidado em uma etapa futura.

## Documentos de entrega

- Checklist final: `docs/checklist-mvp.md`
- Deploy: `docs/deploy.md`
- Specs do projeto: `specs/`
