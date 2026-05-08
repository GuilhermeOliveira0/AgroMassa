# AgroMassa - Tasks do MVP

**Idea**: `specs/01-ideia.md`
**Spec**: `specs/02-spec.md`
**Design**: `specs/03-design.md`
**Status**: Draft
**Fase**: Tasks

---

## Premissas para esta quebra de tarefas

- Projeto greenfield, sem arquivos de aplicacao existentes.
- Nao foi encontrado `TESTING.md` no repositorio.
- As tarefas abaixo assumem verificacao manual por etapa e gate minimo de lint, typecheck e build quando o projeto ja estiver estruturado.
- Cada tarefa foi mantida pequena o suficiente para ser implementada isoladamente.

---

## Fase 1. Setup inicial do projeto

### T01 - Inicializar projeto Next.js com TypeScript e Tailwind

**Status**: Concluida

**Objetivo**: criar a base do projeto web com App Router, TypeScript e Tailwind CSS.
**Arquivos provaveis envolvidos**: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.*`, `tailwind.config.*`, `app/layout.tsx`, `app/globals.css`
**Passos de implementacao**:
- inicializar a aplicacao Next.js com App Router
- configurar TypeScript e Tailwind
- organizar alias de importacao e estrutura inicial de pastas
**Criterios de conclusao**:
- projeto sobe localmente
- App Router e Tailwind estao funcionais
- estrutura inicial do design tecnico existe no repositorio
**Testes manuais necessarios**:
- iniciar o servidor e abrir a pagina inicial padrao
- confirmar que estilos globais estao sendo aplicados
**Dependencias**: nenhuma

### T02 - Configurar dependencias base do MVP

**Status**: Concluida

**Objetivo**: instalar e registrar dependencias de runtime e desenvolvimento previstas no design.
**Arquivos provaveis envolvidos**: `package.json`, `package-lock.json` ou equivalente, `.gitignore`, `.env.example`
**Passos de implementacao**:
- instalar Prisma, Auth.js, bcrypt, Zod e cliente Supabase
- criar `.env.example` com variaveis previstas
- ajustar `.gitignore` para ambiente local e build
**Criterios de conclusao**:
- dependencias principais estao instaladas
- variaveis esperadas estao documentadas em `.env.example`
- o projeto continua compilando
**Testes manuais necessarios**:
- rodar instalacao limpa das dependencias
- confirmar que o projeto ainda inicia sem erros de modulo ausente
**Dependencias**: T01

---

## Fase 2. Banco de dados e Prisma

### T03 - Criar schema Prisma inicial com tabelas e enums

**Status**: Concluida

**Objetivo**: modelar `admin_users`, `site_settings`, `products` e `product_images` conforme o design.
**Arquivos provaveis envolvidos**: `prisma/schema.prisma`
**Passos de implementacao**:
- definir datasource e generator
- criar modelos e relacionamentos
- criar enums de status, categoria e condicao
**Criterios de conclusao**:
- schema Prisma representa o design aprovado
- relacionamentos e campos obrigatorios estao definidos
- `prisma validate` passa
**Testes manuais necessarios**:
- validar o schema com Prisma
- revisar se todos os campos do design aparecem no schema
**Dependencias**: T02

### T04 - Criar primeira migracao e utilitarios de acesso ao banco

**Status**: Concluida

**Objetivo**: preparar a persistencia inicial e o cliente Prisma reutilizavel.
**Arquivos provaveis envolvidos**: `prisma/migrations/*`, `src/lib/db/prisma.ts`, `package.json`
**Passos de implementacao**:
- gerar migracao inicial
- criar cliente Prisma singleton
- adicionar scripts de migracao e studio
**Criterios de conclusao**:
- migracao inicial e gerada sem erro
- cliente Prisma pode ser importado pela aplicacao
- scripts de banco estao disponiveis
**Testes manuais necessarios**:
- executar migracao em ambiente local
- abrir Prisma Studio e confirmar que as tabelas existem
**Dependencias**: T03

### T05 - Criar seed inicial de administrador e configuracoes institucionais

**Status**: Concluida

**Objetivo**: popular o banco com o administrador inicial e os dados institucionais basicos.
**Arquivos provaveis envolvidos**: `prisma/seed.ts`, `.env.example`, `package.json`
**Passos de implementacao**:
- ler credenciais do admin por variaveis de ambiente
- gerar hash da senha
- criar seed de `admin_users`
- criar seed de `site_settings` com dados iniciais da AgroMassa
**Criterios de conclusao**:
- seed cria um administrador ativo
- seed cria configuracao institucional inicial
- seed pode ser executado sem duplicar registros indevidamente
**Testes manuais necessarios**:
- rodar seed em banco limpo
- confirmar no banco que admin e configuracoes foram criados
**Dependencias**: T04

### T06 - Preparar extensoes e indices de busca do banco

**Status**: Concluida

**Objetivo**: habilitar base tecnica para busca normalizada e listagem eficiente.
**Arquivos provaveis envolvidos**: `prisma/migrations/*`, possivelmente `prisma/schema.prisma`
**Passos de implementacao**:
- adicionar extensoes necessarias no banco quando aplicavel
- criar indices para filtros e ordenacao
- preparar campo de busca normalizada no modelo de produtos
**Criterios de conclusao**:
- indices essenciais do catalogo existem
- estrutura de busca suporta filtros e ordenacao do MVP
- migracao adicional roda sem erro
**Testes manuais necessarios**:
- revisar no banco se indices e extensoes foram aplicados
- validar que a migracao roda em ambiente limpo
**Dependencias**: T04

---

## Fase 3. Autenticacao administrativa

### T07 - Configurar Auth.js com Credentials Provider

**Status**: Concluida

**Objetivo**: criar a configuracao central de autenticacao para o administrador.
**Arquivos provaveis envolvidos**: `src/lib/auth/auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `src/lib/auth/config.ts`
**Passos de implementacao**:
- configurar Auth.js com credenciais
- integrar busca do admin pelo Prisma
- configurar sessao JWT e callbacks minimos
**Criterios de conclusao**:
- rota de autenticacao existe
- credenciais podem ser validadas contra `admin_users`
- a configuracao da sessao segue o design
**Testes manuais necessarios**:
- acessar a rota de auth e confirmar que responde
- simular login com usuario seeded
**Dependencias**: T05

### T08 - Criar tela de login administrativa

**Status**: Concluida

**Objetivo**: disponibilizar o formulario visual de login em `/admin/login`.
**Arquivos provaveis envolvidos**: `app/admin/login/page.tsx`, `src/components/admin/login-form.tsx`, `src/validators/auth/login.ts`
**Passos de implementacao**:
- criar layout da pagina de login
- criar formulario com email e senha
- adicionar validacao basica de entrada
**Criterios de conclusao**:
- formulario renderiza corretamente
- erros basicos de validacao aparecem
- submissao dispara o fluxo de login
**Testes manuais necessarios**:
- tentar login com campos vazios
- tentar login com admin seeded
**Dependencias**: T07

### T09 - Proteger rotas administrativas com middleware

**Status**: Concluida

**Objetivo**: impedir acesso anonimo a `/admin/*`, exceto `/admin/login`.
**Arquivos provaveis envolvidos**: `middleware.ts` ou `proxy.ts`, `src/lib/auth/auth.ts`
**Passos de implementacao**:
- criar middleware de protecao
- permitir excecao para login
- definir redirecionamento do usuario nao autenticado
**Criterios de conclusao**:
- rotas admin exigem sessao valida
- login continua acessivel sem autenticacao
- usuario autenticado navega na area admin
**Testes manuais necessarios**:
- abrir `/admin` sem sessao e validar redirecionamento
- abrir `/admin` com sessao e validar acesso
**Dependencias**: T08

---

## Fase 4. Layout publico e identidade visual

### T10 - Criar shell publico global com header e footer

**Status**: Concluida

**Objetivo**: estruturar a base visual publica do site com identidade AgroMassa.
**Arquivos provaveis envolvidos**: `app/layout.tsx`, `src/components/public/site-header.tsx`, `src/components/public/site-footer.tsx`, `app/globals.css`
**Passos de implementacao**:
- criar header com marca e navegacao
- criar footer com contatos e cidade/estado
- aplicar paleta, tipografia e tokens visuais baseados na logo
**Criterios de conclusao**:
- header e footer aparecem em todas as paginas publicas
- identidade visual segue o design aprovado
- layout se adapta ao mobile
**Testes manuais necessarios**:
- abrir home e catalogo em larguras diferentes
- conferir presenca da logo e cores base
**Dependencias**: T02

### T11 - Implementar home institucional inicial

**Status**: Concluida

**Objetivo**: criar a pagina institucional publica da AgroMassa lendo configuracoes do banco.
**Arquivos provaveis envolvidos**: `app/(public)/page.tsx`, `src/features/institutional/get-site-settings.ts`, `src/components/public/home-hero.tsx`, `src/components/public/about-section.tsx`
**Passos de implementacao**:
- buscar `site_settings`
- montar secoes institucionais principais
- exibir servicos, telefone, WhatsApp e Sao Francisco-SP
**Criterios de conclusao**:
- home publica exibe dados institucionais reais
- servicos aparecem de forma clara
- CTA principal esta presente
**Testes manuais necessarios**:
- abrir a home e verificar dados institucionais seeded
- testar layout mobile e desktop
**Dependencias**: T05, T10

---

## Fase 5. Catalogo publico

### T12 - Criar consulta publica de produtos com regras de visibilidade

**Status**: Concluida

**Objetivo**: implementar a regra de listagem publica apenas para produtos validos e visiveis.
**Arquivos provaveis envolvidos**: `src/features/products/public-list-products.ts`, `src/lib/search/normalize.ts`, possivelmente `src/types/product.ts`
**Passos de implementacao**:
- criar consulta de produtos publicos
- aplicar regras de `is_public_visible`, `is_archived`, `status` e imagem principal
- aplicar ordenacao por destaque e data
**Criterios de conclusao**:
- consulta retorna apenas produtos publicos validos
- ordenacao padrao segue o design
- campo de busca normalizada e considerado
**Testes manuais necessarios**:
- criar cenarios com produto visivel e nao visivel
- validar ordem de retorno entre destaque e nao destaque
**Dependencias**: T06

### T13 - Criar pagina publica de catalogo/listagem de produtos

**Status**: Concluida

**Objetivo**: montar a tela `/produtos` consumindo a consulta publica da T12 e exibindo cards de produtos publicos.
**Arquivos provaveis envolvidos**: `app/(public)/produtos/page.tsx`, `src/components/public/product-card.tsx`
**Passos de implementacao**:
- renderizar lista de cards
- consumir a consulta publica existente sem duplicar regras de visibilidade
- exibir estado vazio e informacoes resumidas do produto
**Criterios de conclusao**:
- catalogo exibe nome, categoria, condicao, status, preco e foto principal
- estado vazio aparece quando apropriado
- apenas produtos publicos validos aparecem
**Testes manuais necessarios**:
- abrir `/produtos`
- validar responsividade dos cards
- confirmar que rascunhos, arquivados, invisiveis e produtos sem imagem principal nao aparecem
**Dependencias**: T12

### T14 - Criar pagina publica de catalogo com cards

**Status**: Concluida

**Objetivo**: montar a tela `/produtos` consumindo a consulta publica e exibindo cards.
**Arquivos provaveis envolvidos**: `app/(public)/produtos/page.tsx`, `src/components/public/product-card.tsx`, `src/components/public/catalog-filters.tsx`
**Passos de implementacao**:
- renderizar lista de cards
- renderizar controles de filtros
- exibir estado vazio e informacoes resumidas do produto
**Criterios de conclusao**:
- catalogo exibe nome, marca, modelo, status, preco e foto principal
- estado vazio aparece quando apropriado
- filtros e busca alteram a URL e a listagem
**Testes manuais necessarios**:
- abrir `/produtos` com e sem filtros
- validar responsividade dos cards
**Dependencias**: T10, T13

### T15 - Implementar comportamento de "Carregar mais"

**Status**: Concluida

**Objetivo**: adicionar carregamento progressivo do catalogo sem paginacao numerica.
**Arquivos provaveis envolvidos**: `app/(public)/produtos/page.tsx`, `src/components/public/load-more-button.tsx`, `src/features/products/public-list-products.ts`
**Passos de implementacao**:
- definir limite inicial por pagina
- calcular proxima pagina a partir de `page`
- exibir botao "Carregar mais" somente quando houver mais resultados
**Criterios de conclusao**:
- catalogo carrega blocos adicionais corretamente
- ordenacao global do catalogo e preservada
- o botao some quando nao houver mais produtos
**Testes manuais necessarios**:
- navegar por multiplas paginas de resultados
- confirmar que nao ha duplicidade ou quebra de ordenacao
**Dependencias**: T14

---

## Fase 6. Detalhes do produto

### T16 - Criar consulta publica de detalhe por slug

**Status**: Concluida

**Objetivo**: buscar um produto publico unico para a rota `/produtos/[slug]`.
**Arquivos provaveis envolvidos**: `src/features/products/get-public-product-by-slug.ts`
**Passos de implementacao**:
- buscar produto pelo `slug`
- validar regras de visibilidade publica
- incluir galeria de imagens e dados completos
**Criterios de conclusao**:
- produto visivel e retornado com dados completos
- produto invalido ou oculto resulta em ausencia controlada
- galeria vem ordenada corretamente
**Testes manuais necessarios**:
- acessar slug valido
- acessar slug oculto, rascunho ou inexistente
**Dependencias**: T12

### T17 - Implementar pagina dedicada de detalhes do produto

**Status**: Concluida

**Objetivo**: renderizar a pagina `/produtos/[slug]` com galeria, dados tecnicos e CTA.
**Arquivos provaveis envolvidos**: `app/(public)/produtos/[slug]/page.tsx`, `src/components/public/product-gallery.tsx`, `src/components/public/product-detail.tsx`
**Passos de implementacao**:
- criar layout de detalhe
- exibir galeria e informacoes completas
- tratar preco opcional e status visual
**Criterios de conclusao**:
- pagina mostra galeria, especificacoes e status
- preco aparece quando houver
- "sob consulta" aparece quando nao houver preco
**Testes manuais necessarios**:
- abrir produto com preco
- abrir produto sem preco
- testar comportamento em mobile e desktop
**Dependencias**: T16

---

## Fase 7. WhatsApp

### T18 - Criar utilitario central de link do WhatsApp

**Status**: Concluida

**Objetivo**: centralizar a geracao do link `wa.me` com mensagem padrao e nome do produto.
**Arquivos provaveis envolvidos**: `src/lib/utils/whatsapp.ts`, possivelmente `src/types/product.ts`
**Passos de implementacao**:
- montar numero tecnico `5517997278876`
- interpolar nome do produto no texto padrao
- aplicar encode seguro na URL
**Criterios de conclusao**:
- utilitario gera link correto para produto e para contato institucional
- texto segue exatamente a spec
- nao ha duplicacao de logica entre home, card e detalhe
**Testes manuais necessarios**:
- gerar link com nome de produto simples
- gerar link com nome contendo espacos e acentos
**Dependencias**: T11, T17

### T19 - Aplicar CTAs de WhatsApp na home, cards e detalhe

**Status**: Concluida

**Objetivo**: usar o utilitario central em todos os pontos publicos de conversao.
**Arquivos provaveis envolvidos**: `src/components/public/home-hero.tsx`, `src/components/public/product-card.tsx`, `src/components/public/product-detail.tsx`
**Passos de implementacao**:
- adicionar CTA institucional
- adicionar CTA em card
- adicionar CTA no detalhe
**Criterios de conclusao**:
- todos os pontos publicos abrem o mesmo numero
- produto correto entra na mensagem dos cards e detalhe
- CTA institucional funciona sem depender de produto
**Testes manuais necessarios**:
- clicar nos tres tipos de CTA
- validar numero e mensagem gerada
**Dependencias**: T18

---

## Fase 8. Painel administrativo

### T20 - Criar shell administrativo e dashboard inicial

**Status**: Concluida

**Objetivo**: montar a base visual da area administrativa autenticada.
**Arquivos provaveis envolvidos**: `app/admin/layout.tsx`, `app/admin/page.tsx`, `src/components/admin/admin-sidebar.tsx`, `src/components/admin/admin-header.tsx`
**Passos de implementacao**:
- criar layout administrativo
- criar navegacao basica entre dashboard, produtos e institucional
- mostrar informacoes resumidas iniciais
**Criterios de conclusao**:
- area admin tem layout proprio
- navegacao interna funciona
- rota `/admin` abre somente com sessao
**Testes manuais necessarios**:
- acessar dashboard autenticado
- navegar entre modulos administrativos
**Dependencias**: T09

### T21 - Criar listagem administrativa de produtos

**Status**: Concluida

**Objetivo**: permitir ao administrador localizar e abrir produtos para manutencao.
**Arquivos provaveis envolvidos**: `app/admin/produtos/page.tsx`, `src/features/products/admin-list-products.ts`, `src/components/admin/products-table.tsx`
**Passos de implementacao**:
- criar consulta administrativa incluindo rascunhos e arquivados
- renderizar lista com status, destaque, visibilidade e datas
- adicionar busca interna basica por nome ou marca
**Criterios de conclusao**:
- administrador consegue localizar produtos
- listagem mostra status administrativos relevantes
- acoes de editar e criar ficam acessiveis
**Testes manuais necessarios**:
- listar produtos de multiplos status
- buscar produto por nome ou marca
**Dependencias**: T20

### T22 - Criar formulario administrativo de produto em modo rascunho/publicacao

**Status**: Concluida

**Objetivo**: disponibilizar formulario base para criar e editar produtos.
**Arquivos provaveis envolvidos**: `src/components/admin/product-form.tsx`, `app/admin/produtos/novo/page.tsx`, `app/admin/produtos/[id]/page.tsx`, `src/validators/products/admin-product.ts`
**Passos de implementacao**:
- criar formulario com campos do produto
- diferenciar modo rascunho e modo publicar
- mapear valores iniciais e submissao
**Criterios de conclusao**:
- formulario cobre todos os campos do MVP
- edicao e criacao usam o mesmo componente base
- botoes de salvar rascunho e publicar estao separados
**Testes manuais necessarios**:
- abrir tela de novo produto
- abrir tela de edicao com dados existentes
**Dependencias**: T21

### T23 - Implementar criacao, edicao e arquivamento de produtos

**Status**: Concluida

**Objetivo**: conectar o formulario ao backend administrativo com regras de negocio.
**Arquivos provaveis envolvidos**: `app/api/admin/produtos/route.ts`, `app/api/admin/produtos/[id]/route.ts`, `src/features/products/save-product.ts`, `src/features/products/archive-product.ts`
**Passos de implementacao**:
- criar endpoint de criacao
- criar endpoint de atualizacao
- criar acao de arquivamento ou inativacao
- persistir datas e campos de auditoria
**Criterios de conclusao**:
- produto pode ser salvo como rascunho
- produto pode ser publicado quando estiver valido
- produto pode ser arquivado sem exclusao fisica
**Testes manuais necessarios**:
- salvar rascunho incompleto
- publicar produto completo
- arquivar produto e confirmar efeito no admin
**Dependencias**: T22

---

## Fase 9. Upload de fotos

### T24 - Integrar cliente de storage e endpoint autenticado de upload

**Status**: Concluida

**Objetivo**: criar a base tecnica para envio de imagens ao Supabase Storage.
**Arquivos provaveis envolvidos**: `src/lib/storage/supabase-storage.ts`, `app/api/admin/uploads/route.ts`
**Passos de implementacao**:
- configurar cliente do Supabase Storage
- criar endpoint autenticado de upload
- gerar `storage_key` seguro por UUID
**Criterios de conclusao**:
- endpoint aceita apenas admin autenticado
- arquivo valido chega ao storage
- resposta retorna metadados suficientes para o formulario
**Testes manuais necessarios**:
- enviar uma imagem valida autenticado
- tentar enviar imagem sem autenticacao
**Dependencias**: T09, T04

### T25 - Persistir metadados de imagem e vincular ao produto

**Status**: Concluida

**Objetivo**: gravar `product_images` e permitir definicao de imagem principal.
**Arquivos provaveis envolvidos**: `src/features/products/attach-product-image.ts`, `src/features/products/set-main-image.ts`, `app/api/admin/uploads/route.ts`
**Passos de implementacao**:
- salvar registro de imagem no banco
- vincular imagem ao produto
- marcar imagem principal
**Criterios de conclusao**:
- upload gera registro em `product_images`
- produto pode ter imagem principal definida
- integridade entre `main_image_id` e imagens do produto e preservada
**Testes manuais necessarios**:
- subir imagem e conferir registro no banco
- marcar imagem principal e revisar produto salvo
**Dependencias**: T24, T23

### T26 - Adicionar UI de upload e galeria no formulario administrativo

**Status**: Concluida

**Objetivo**: permitir que o administrador envie, visualize e organize ate 8 fotos por produto.
**Arquivos provaveis envolvidos**: `src/components/admin/product-image-uploader.tsx`, `src/components/admin/product-image-gallery.tsx`, `src/components/admin/product-form.tsx`
**Passos de implementacao**:
- criar area de upload com preview
- listar imagens vinculadas ao produto
- permitir escolha da imagem principal
**Criterios de conclusao**:
- admin consegue enviar imagens pelo formulario
- preview funciona
- imagem principal pode ser escolhida visualmente
**Testes manuais necessarios**:
- enviar multiplas imagens
- alterar imagem principal
- tentar exceder 8 imagens
**Dependencias**: T25

---

## Fase 10. Configuracoes institucionais

### T27 - Criar leitura centralizada de configuracoes institucionais

**Status**: Concluida

**Objetivo**: centralizar consulta de `site_settings` para uso publico e administrativo.
**Arquivos provaveis envolvidos**: `src/features/institutional/get-site-settings.ts`, `src/types/site-settings.ts`
**Passos de implementacao**:
- criar consulta por configuracao ativa
- tipar retorno institucional
- preparar reuse para home e admin
**Criterios de conclusao**:
- home e admin podem consumir a mesma fonte institucional
- retorno cobre todos os campos da tabela
**Testes manuais necessarios**:
- consumir funcao em tela publica e administrativa
- validar dados seeded
**Dependencias**: T05

### T28 - Criar tela administrativa de configuracoes institucionais

**Status**: Concluida

**Objetivo**: permitir editar nome, texto, servicos, telefone, WhatsApp e localizacao da empresa.
**Arquivos provaveis envolvidos**: `app/admin/institucional/page.tsx`, `src/components/admin/institutional-form.tsx`, `src/validators/institutional/site-settings.ts`
**Passos de implementacao**:
- criar formulario administrativo
- preencher com valores atuais do banco
- criar submissao de atualizacao
**Criterios de conclusao**:
- admin consegue editar configuracoes institucionais
- alteracoes persistem no banco
- home passa a refletir os dados atualizados
**Testes manuais necessarios**:
- editar texto institucional
- editar telefone ou WhatsApp e revisar a home
**Dependencias**: T20, T27

---

## Fase 11. Validacoes e seguranca

### T29 - Consolidar validacoes de produto para rascunho, publicacao e upload

**Status**: Concluida

**Objetivo**: garantir que regras de negocio estejam aplicadas de forma consistente.
**Arquivos provaveis envolvidos**: `src/validators/products/admin-product.ts`, `src/validators/products/public-filters.ts`, `src/validators/uploads/product-image.ts`
**Passos de implementacao**:
- separar validacao de rascunho da validacao de publicacao
- validar tamanho e formato de imagem
- validar campos obrigatorios e limites de fotos
**Criterios de conclusao**:
- rascunho aceita campos minimos
- publicacao bloqueia produto incompleto
- upload rejeita arquivos invalidos
**Testes manuais necessarios**:
- publicar produto sem imagem principal
- publicar produto sem campos obrigatorios
- subir arquivo acima de 5 MB
**Dependencias**: T23, T26

### T30 - Aplicar endurecimento basico de seguranca e tratamento de erros

**Status**: Concluida

**Objetivo**: adicionar protecoes minimas em auth, admin e upload.
**Arquivos provaveis envolvidos**: `middleware.ts` ou `proxy.ts`, `src/lib/auth/auth.ts`, `app/api/admin/uploads/route.ts`, `app/api/admin/produtos/*.ts`, utilitarios de erro
**Passos de implementacao**:
- revisar mensagens de erro expostas
- reforcar validacoes server-side
- limitar superficie de acesso a endpoints administrativos
- registrar comportamento minimo para tentativas invalidas de login
**Criterios de conclusao**:
- endpoints admin falham de forma controlada sem vazar detalhes internos
- rotas criticas fazem verificacao de sessao no servidor
- upload e auth seguem as regras basicas do design
**Testes manuais necessarios**:
- chamar endpoint admin sem sessao
- tentar login invalido repetido
- tentar upload com tipo nao permitido
**Dependencias**: T29

---

## Fase 12. Testes finais e refinamentos

### T31 - Validar fluxo ponta a ponta do catalogo publico

**Status**: Concluida

**Objetivo**: verificar que a experiencia publica completa atende a spec.
**Arquivos provaveis envolvidos**: ajustes eventuais em `app/(public)/*`, `src/components/public/*`, `src/features/products/*`
**Passos de implementacao**:
- testar home, catalogo, filtros, carregar mais, detalhe e WhatsApp
- corrigir inconsistencias visuais ou funcionais encontradas
- revisar responsividade principal
**Criterios de conclusao**:
- fluxo publico do MVP funciona sem bloqueios
- detalhes, filtros e CTA de WhatsApp estao coerentes
- ajustes encontrados nesta revisao foram aplicados
**Testes manuais necessarios**:
- navegar do inicio ao detalhe de produto
- aplicar filtros, usar carregar mais e acionar WhatsApp
- testar em mobile e desktop
**Dependencias**: T19, T17, T15

### T32 - Validar fluxo administrativo ponta a ponta e preparar entrega do MVP

**Status**: Concluida

**Objetivo**: revisar o fluxo completo do admin e fechar pendencias de acabamento.
**Arquivos provaveis envolvidos**: ajustes eventuais em `app/admin/*`, `src/components/admin/*`, `src/features/*`, `prisma/seed.ts`
**Passos de implementacao**:
- testar login, dashboard, listagem, cadastro, upload, publicacao, arquivamento e configuracoes institucionais
- corrigir bugs finais do fluxo administrativo
- revisar estados vazios, mensagens e navegacao
**Criterios de conclusao**:
- fluxo administrativo completo funciona com o admin seeded
- produtos publicados refletem corretamente no site publico
- configuracoes institucionais e imagens estao integradas
**Testes manuais necessarios**:
- fazer login e cadastrar produto completo
- publicar produto com imagem principal
- editar configuracao institucional e validar refletido na home
- arquivar produto e validar remocao da area publica
**Dependencias**: T28, T30, T31

---

## Sequenciamento resumido

```text
T01 -> T02
T02 -> T03 -> T04 -> T05 -> T06
T05 -> T07 -> T08 -> T09
T02 -> T10
T05 + T10 -> T11
T06 -> T12 -> T13 -> T14 -> T15
T12 -> T16 -> T17
T11 + T17 -> T18 -> T19
T09 -> T20 -> T21 -> T22 -> T23
T09 + T04 -> T24 -> T25 -> T26
T05 -> T27 -> T28
T23 + T26 -> T29 -> T30
T19 + T17 + T15 -> T31
T28 + T30 + T31 -> T32
```

---

## Observacao final

As tarefas foram mantidas pequenas e sequenciais para permitir execucao uma por vez. Em um segundo momento, depois da sua aprovacao, podemos ajustar o `04-tasks.md` para marcar status de cada tarefa conforme a implementacao avancar.
