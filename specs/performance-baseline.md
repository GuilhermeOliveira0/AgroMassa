# Baseline de performance e seguranca - AgroMassa

Data da analise: 2026-05-12  
Timezone: America/Sao_Paulo

## Analise inicial antes de alteracoes

### Arquivos lidos

- `specs/01-ideia.md`
- `specs/02-spec.md`
- `specs/03-design.md`
- `specs/04-tasks.md`
- `package.json`
- `prisma/schema.prisma`
- `app/layout.tsx`
- `app/(public)/page.tsx`
- `app/(public)/produtos/page.tsx`
- `app/admin/(protected)/page.tsx`
- `app/admin/(protected)/produtos/page.tsx`
- `src/features/products/public-list-products.ts`
- `src/lib/db/prisma.ts`
- `src/lib/auth/auth.ts`
- `src/lib/auth/config.ts`
- `src/lib/auth/secret.ts`
- `app/admin/login/page.tsx`
- `prisma.config.ts`

### Scripts encontrados

- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `lint`: `eslint .`
- `typecheck`: `tsc --noEmit`
- `prisma:validate`: `prisma validate`
- `prisma:generate`: `prisma generate`
- `prisma:migrate`: `prisma migrate dev`
- `prisma:seed`: `node --experimental-strip-types prisma/seed.ts`
- `prisma:seed:test`: `node --experimental-strip-types prisma/seed-test-data.ts`
- `prisma:studio`: `node scripts/prisma-studio.mjs`

### Validacoes possiveis no ambiente

- Validacao Prisma via `npm run prisma:validate`.
- Typecheck via `npm run typecheck`.
- Lint via `npm run lint`.
- Build de producao via `npm run build`.
- Verificacao local de rotas via `npm run start` apos build.
- Verificacao somente leitura do banco via Prisma Client.
- Teste manual em browser ficou parcialmente limitado pelo bloqueio do browser embutido em `localhost`/`127.0.0.1` na porta de dev, mas funcionou depois no servidor de producao local na porta 3002.

### Rotas criticas consideradas

- `/`
- `/produtos`
- `/produtos?page=2`
- `/admin`
- `/admin/produtos`
- Apoio: `/admin/login`, para diferenciar erro de configuracao auth das paginas admin protegidas.

### Riscos antes de iniciar otimizacoes

- `AUTH_SECRET` e `NEXTAUTH_SECRET` estao documentadas em `.env.example`, mas ausentes no `.env` atual; em `NODE_ENV=production`, as rotas admin protegidas redirecionam para erro de configuracao do NextAuth.
- O `npm run dev` falhou no sandbox com `spawn EPERM`; fora do sandbox, o Next detectou servidor dev concorrente/instavel e houve erro `EPIPE`.
- Rotas publicas funcionam em producao local, mas apresentaram tempos percebidos de 4s a 8s no browser e 2s a 3.2s por `curl`, antes de qualquer otimizacao.
- O catalogo atual tem 8 produtos totais e 6 produtos minimamente visiveis; como o page size publico e 9, nao havia botao "Carregar mais" para validar clique real.
- Fluxos autenticados de admin nao puderam ser validados em producao local por falta de secret de auth.
- Acesso a informacoes de sistema via CIM foi negado no ambiente; OS registrado por API .NET.

## Ambiente

- Sistema operacional: Microsoft Windows NT 10.0.26200.0
- Shell: PowerShell
- Branch Git: `otm`
- Node: `v22.22.2`
- npm: `10.9.7`
- Next.js reportado no build/start: `16.2.4`
- Banco configurado: sim, `DATABASE_URL` e `DIRECT_URL` existem no `.env`.
- Banco acessivel: sim, checagem somente leitura retornou `site_settings=1`, `products=8`, `admin_users=2`.
- Variaveis documentadas em `.env.example`: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AGROMASSA_WHATSAPP_DISPLAY`, `AGROMASSA_WHATSAPP_DIGITS`, `AGROMASSA_CITY`, `AGROMASSA_STATE`.
- Variaveis presentes no `.env`, sem expor valores: `DATABASE_URL`, `DIRECT_URL`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`.
- Variaveis documentadas mas ausentes no `.env`: `AUTH_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AGROMASSA_WHATSAPP_DISPLAY`, `AGROMASSA_WHATSAPP_DIGITS`, `AGROMASSA_CITY`, `AGROMASSA_STATE`.

## Resultado dos comandos

| Comando | Resultado | Observacoes |
| ------- | --------- | ----------- |
| `node -v` | aprovado | Retornou `v22.22.2`. |
| `npm -v` | aprovado | Retornou `10.9.7`. |
| `npm run prisma:validate` | aprovado | Schema Prisma valido. |
| `npm run typecheck` | aprovado | `tsc --noEmit` finalizou sem erros. |
| `npm run lint` | aprovado | `eslint .` finalizou sem erros. |
| `npm run build` | falhou no sandbox, aprovado fora do sandbox | No sandbox falhou com `Error: spawn EPERM`. Reexecutado fora do sandbox, compilou, tipou, gerou paginas e listou rotas com sucesso. |
| `npm run dev -- --hostname 127.0.0.1 --port 3000` | falhou no sandbox | `next dev` falhou com `Error: spawn EPERM`. |
| `npm run dev -- --hostname 127.0.0.1 --port 3001` | instavel fora do sandbox | Iniciou e em seguida apontou outro dev server em `localhost:3000`, PID 16800, com mensagem `Another next dev server is already running`. |
| `npm run start -- --hostname 127.0.0.1 --port 3002` | aprovado | Servidor de producao local abriu em `http://127.0.0.1:3002`. |
| Checagem Prisma somente leitura | aprovado | `site_settings=1`, `products=8`, `admin_users=2`. |
| Checagem de produtos visiveis | aprovado | `totalProducts=8`, `minimallyVisibleProducts=6`. |

## Rotas testadas

As medidas abaixo foram feitas no servidor de producao local em `http://127.0.0.1:3002`, apos `npm run build`.

| Rota | Resultado | Observacoes |
| ---- | --------- | ----------- |
| `/` | abriu | Browser: 4336 ms, titulo `AgroMassa`, sem erros/warnings de console capturados. `curl`: HTTP 200, 2.012577 s, 24796 bytes. |
| `/produtos` | abriu | Browser: 7007 ms, titulo `AgroMassa`, sem erros/warnings de console capturados. `curl`: HTTP 200, 2.808535 s, 69363 bytes. |
| `/produtos?page=2` | abriu | Browser: 8655 ms, titulo `AgroMassa`, sem erros/warnings de console capturados. `curl`: HTTP 200, 3.224035 s, 69402 bytes. |
| `/admin` | erro de configuracao auth | Redirecionou para `/api/auth/error?error=Configuration`. Browser: 2382 ms. `curl -L`: HTTP 500, 0.082322 s. |
| `/admin/produtos` | erro de configuracao auth | Redirecionou para `/api/auth/error?error=Configuration`. Browser: 2136 ms. `curl -L`: HTTP 500, 0.058765 s. |
| `/admin/login` | abriu | Rota de apoio para diagnostico. Browser: 3479 ms, formulario de login presente, sem logs de console. `curl`: HTTP 200, 0.042715 s, 13460 bytes. |

## Fluxos registrados

| Fluxo | Resultado | Observacoes |
| ----- | --------- | ----------- |
| Abertura do catalogo publico | parcial/aprovado | `/produtos` abriu em producao local, mas com tempo percebido alto. |
| Clique em "Carregar mais" | nao testado | O botao nao apareceu porque havia 6 produtos minimamente visiveis e o page size publico atual e 9. |
| Abertura do painel admin | falhou por configuracao | `/admin` redirecionou para erro do NextAuth por falta de secret em ambiente de producao. |
| Abertura da listagem admin de produtos | falhou por configuracao | `/admin/produtos` redirecionou para erro do NextAuth pelo mesmo motivo. |
| Acao rapida de produto | nao testado | Requer acesso admin autenticado; bloqueado pelo erro de configuracao auth. |
| Criacao/edicao de produto | nao testado | Requer acesso admin autenticado; bloqueado pelo erro de configuracao auth. |
| Upload de imagem | nao testado | Requer acesso admin autenticado; bloqueado pelo erro de configuracao auth. |

## Pontos de lentidao percebidos

- `/produtos` levou cerca de 7.0 s no browser e 2.8 s por `curl` em producao local.
- `/produtos?page=2` levou cerca de 8.7 s no browser e 3.2 s por `curl` em producao local.
- `/` levou cerca de 4.3 s no browser e 2.0 s por `curl`.
- As rotas publicas dependem de banco e de resolucao de URLs de imagem; nao foi feita nenhuma otimizacao nesta task.

## Erros de terminal

- `npm run build` no sandbox: `Error: spawn EPERM`; build passou fora do sandbox.
- `npm run dev` no sandbox: `Error: spawn EPERM`.
- Tentativa inicial de `Start-Process` no sandbox: `O item ja foi adicionado. Chave contida no dicionario: 'Path'; chave sendo adicionada: 'PATH'`.
- `next dev` fora do sandbox na porta 3001: `Another next dev server is already running`, apontando `localhost:3000`, PID 16800.
- Log do dev server registrou `Error: EPIPE: broken pipe, write` e `uncaughtException`.
- `Get-CimInstance Win32_OperatingSystem` e `Get-CimInstance Win32_Process` falharam com `Acesso negado`.
- Checagem direta com `new PrismaClient()` sem adapter falhou porque Prisma 7 exige `PrismaClientOptions`; a checagem correta usou `src/lib/db/prisma.ts`.
- Import direto de `src/lib/db/prisma.ts` sem `dotenv/config` falhou com `DATABASE_URL or DIRECT_URL is not configured`; com `dotenv/config`, a conexao funcionou.
- Node emitiu warning `MODULE_TYPELESS_PACKAGE_JSON` ao importar arquivo `.ts` diretamente para a checagem local.

## Erros de console

- Nenhum erro ou warning de console foi capturado no browser para `/`, `/produtos`, `/produtos?page=2` e `/admin/login`.
- `/admin` e `/admin/produtos` nao chegaram ao painel; redirecionaram para pagina de erro de configuracao auth.
- O browser embutido bloqueou a primeira tentativa de abrir `localhost`/`127.0.0.1` na porta de dev com `net::ERR_BLOCKED_BY_CLIENT`; a verificacao final foi feita no servidor de producao local na porta 3002.

## Riscos antes das otimizacoes

- Falta configurar `AUTH_SECRET` ou `NEXTAUTH_SECRET` para validar o admin em producao local.
- As rotas publicas ja apresentam latencia perceptivel antes das otimizacoes.
- O fluxo de `next dev` ficou instavel no ambiente de validação por EPERM, servidor concorrente e EPIPE; para comparacoes futuras, usar preferencialmente build + `next start` quando possivel.
- Catalogo atual nao tem volume suficiente para exercitar o botao "Carregar mais"; T42/T43 devem usar dados suficientes antes de medir paginacao.
- Qualquer otimizacao de cache precisa preservar dados institucionais e catalogo atualizados, pois as paginas publicas hoje estao marcadas como `force-dynamic`.
- Otimizacoes de imagem devem considerar que os produtos usam Supabase Storage e URLs derivadas por `getProductImageDisplayUrl`.

## Observacoes para T41 ate T46

- T41: medir e tratar imagens considerando Supabase Storage, tamanho/URL final e impacto nos tempos de `/produtos`.
- T42: antes de alterar consulta do catalogo, criar massa ou usar ambiente com mais de 9 produtos publicos para testar "Carregar mais" de forma real.
- T43: listagem admin nao pode ser medida enquanto auth em producao local estiver sem secret; configurar `AUTH_SECRET`/`NEXTAUTH_SECRET` antes.
- T44: acoes rapidas nao foram testadas neste baseline por bloqueio de auth; primeiro baseline comparavel deve registrar tempo de clique apos login funcional.
- T45: avaliar cache publico com cuidado porque `/` e `/produtos` usam dados de banco e hoje estao `force-dynamic`.
- T46: investigar tambem warning `MODULE_TYPELESS_PACKAGE_JSON` em scripts diretos, caso futuras metricas usem import TS via Node.

## Observacoes apos T46

- Indices adicionados: migration `20260513000100_add_product_performance_indexes` criou `products_admin_listing_idx`, `product_images_product_gallery_idx` e `products_public_visible_listing_idx`.
- Metricas otimizadas: `getAdminDashboardMetrics` deixou de fazer oito `count` separados e passou a usar uma query agregada unica preservando os mesmos campos retornados. A query foi validada contra o banco configurado e retornou uma linha com contagens numericas.
- Dependencias fixadas: todas as entradas `"latest"` do `package.json` foram substituidas pelas versoes ja resolvidas no `package-lock.json`; o lockfile foi sincronizado com `npm install --package-lock-only`.
- Comandos executados: `npm install --package-lock-only` falhou no sandbox por `EPERM` ao criar temp no npm cache e passou fora do sandbox; `npm run prisma:validate`, `npm run typecheck` e `npm run lint` passaram; `npm run build` falhou no sandbox por `spawn EPERM` e passou fora do sandbox.
- Migration local: `npx prisma migrate status` passou fora do sandbox e apontou a nova migration como pendente. O datasource ativo aponta para Supabase remoto (`db.cqpbaozhsozmjbulfzvj.supabase.co`), entao a migration nao foi aplicada automaticamente para evitar alterar banco remoto sem confirmacao operacional.
- Testes manuais: `/produtos` e `/produtos/trator-john-deere-5078e` abriram no browser local sem erros de console capturados. `/admin` e `/admin/produtos` redirecionaram para login; a tentativa automatizada de preencher login no browser embutido foi bloqueada por limitacao do input `email`, entao a validacao visual autenticada do dashboard/listagem admin ficou pendente. A query de metricas foi validada diretamente no banco.
- Pendencias: aplicar a migration com o fluxo de deploy/migrate do ambiente correto antes de producao; validar visualmente `/admin` e `/admin/produtos` em sessao autenticada; revisar logs de imagem do Next em dev (`resolved to private ip`) fora do escopo da T46.
