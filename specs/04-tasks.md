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

## Fase 13. Qualidade tecnica e manutencao

### T33 - Validar qualidade tecnica, otimizar estrutura e limpar codigo do MVP

**Status**: Concluida

**Objetivo**: revisar a base tecnica do MVP para manter o codigo mais simples, limpo, escalavel e sem elementos desnecessarios, preservando integralmente os comportamentos publico e administrativo ja validados.
**Arquivos provaveis envolvidos**: ajustes eventuais em `app/**/*`, `src/components/**/*`, `src/features/**/*`, `src/lib/**/*`, `src/validators/**/*` e documentacao de recomendacoes quando houver pontos grandes demais para alterar com seguranca.
**Passos de implementacao**:
- revisar codigo duplicado, codigo morto, imports nao usados e nomes ruins ou confusos
- verificar separacao entre Server Components, Client Components, queries, validators, server actions e utilitarios
- revisar componentes grandes demais e dividir apenas quando for seguro e sem alterar comportamento
- revisar tratamento de erros, uso de tipagem TypeScript, constantes magicas e logica repetida que possa ser centralizada
- revisar responsividade basica sem redesenhar a UI nem fazer mudancas cosmeticas amplas
- aplicar somente refatoracoes pequenas, seguras e rastreaveis; registrar como recomendacao qualquer ajuste perigoso ou grande demais
- preservar schema Prisma, migracoes, regras de negocio, autenticacao, middleware/proxy, bibliotecas, `.env` real e segredos
- executar os gates `npx prisma validate`, `npm run typecheck`, `npm run lint` e `npm run build`
**Criterios de conclusao**:
- codigo revisado sem alteracao de comportamento publico ou administrativo validado
- duplicacoes, imports inutilizados, nomes confusos e constantes magicas foram ajustados apenas quando isso for seguro
- organizacao entre queries, validators, server actions, utilitarios e componentes continua clara para proximas features
- pontos grandes, arriscados ou fora de escopo foram registrados como recomendacao, nao implementados
- todos os gates obrigatorios passam
**Testes manuais necessarios**:
- abrir `/`, `/produtos` e `/produtos/[slug]` para confirmar catalogo, detalhe, galeria e CTAs de WhatsApp
- abrir `/admin`, `/admin/produtos`, `/admin/produtos/novo`, `/admin/produtos/[id]` e `/admin/institucional`
- validar cadastro, edicao, upload, publicacao, arquivamento e configuracoes institucionais em fluxo basico
- revisar responsividade basica das telas publicas e administrativas sem exigir redesenho
**Dependencias**: T32

---

## Fase 14. Melhorias de usabilidade e operacao administrativa

### T34 - Implementar feedback global, toasts e mensagens de validacao

**Status**: Concluida

**Objetivo**: criar um sistema global de notificacoes visuais para informar sucesso, erro, validacao e falhas inesperadas nas principais acoes do sistema, evitando que o usuario fique sem retorno quando uma acao nao for concluida.

**Arquivos provaveis envolvidos**: `src/components/ui/*`, `src/components/admin/*`, `src/features/products/*`, `src/features/institutional/*`, `app/admin/(protected)/*`, `app/api/admin/uploads/route.ts`, possivelmente `app/layout.tsx` ou layouts administrativos/publicos se for necessario registrar um provider global.

**Passos de implementacao**:
- antes de implementar, ler obrigatoriamente:
  - `.codex/skills/tlc-spec-driven/SKILL.md`
  - `.codex/skills/tlc-spec-driven/references/implement.md`
  - `.codex/skills/tlc-spec-driven/references/coding-principles.md`
  - `specs/01-ideia.md`
  - `specs/02-spec.md`
  - `specs/03-design.md`
  - `specs/04-tasks.md`
- revisar os fluxos administrativos que hoje podem falhar sem feedback claro
- criar ou integrar um mecanismo global de toasts/notificacoes no canto superior direito
- exibir mensagem de sucesso ao salvar rascunho de produto
- exibir mensagem de sucesso ao publicar produto
- exibir mensagem de sucesso ao editar produto existente
- exibir mensagem de sucesso ao arquivar produto
- exibir mensagem de sucesso ao salvar configuracoes institucionais
- exibir mensagem de sucesso ao enviar imagem
- exibir mensagem clara quando faltar campo obrigatorio para publicar
- exibir mensagem clara quando upload falhar por tipo invalido, tamanho invalido, limite de imagens ou erro inesperado
- exibir mensagem generica e segura para falhas inesperadas, sem vazar detalhes internos
- manter erros especificos de campos quando ja existirem, usando o toast como reforco visual
- garantir que as mensagens funcionem em mobile e desktop
- manter o comportamento atual das acoes, alterando apenas o feedback visual
- preservar as regras de negocio, validacoes, autenticacao, upload, publicacao, arquivamento e configuracoes existentes
- executar os gates `npx prisma validate`, `npm run typecheck`, `npm run lint` e `npm run build`

**Criterios de conclusao**:
- usuario recebe feedback visivel quando uma acao administrativa e concluida com sucesso
- usuario recebe feedback visivel quando uma acao falha por validacao
- usuario recebe feedback visivel quando ocorre erro inesperado
- salvar rascunho, publicar, editar, arquivar, upload e configuracoes institucionais nao ficam mais silenciosos
- mensagens de erro nao vazam stack trace, segredo, query, token, URL sensivel ou detalhe interno
- fluxos publicos continuam funcionando sem alteracao de comportamento
- fluxos administrativos existentes continuam funcionando sem alteracao de regra de negocio
- notificacoes aparecem corretamente em mobile e desktop
- todos os gates obrigatorios passam

**Testes manuais necessarios**:
- abrir `/admin/produtos/novo` e salvar rascunho com campos minimos, confirmando toast de sucesso
- tentar publicar produto sem campos obrigatorios, confirmando toast de erro claro
- publicar produto completo com imagem principal, confirmando toast de sucesso
- editar produto existente em `/admin/produtos/[id]`, confirmando toast de sucesso
- arquivar produto existente, confirmando toast de sucesso ou erro controlado
- tentar upload com imagem valida, confirmando toast de sucesso
- tentar upload com arquivo invalido ou acima do limite, confirmando toast de erro
- editar `/admin/institucional` e confirmar toast de sucesso
- simular erro inesperado quando possivel e confirmar mensagem generica segura
- abrir `/`, `/produtos` e `/produtos/[slug]` para confirmar que o publico nao quebrou
- testar em mobile e desktop

**Dependencias**: T33

### T35 - Melhorar dashboard administrativo com metricas operacionais

**Status**: Concluida

**Objetivo**: melhorar o dashboard administrativo para que o vendedor acompanhe rapidamente a situacao dos produtos cadastrados, publicados, disponiveis, visiveis, rascunhos, arquivados, destaques e produtos que precisam de atencao.

**Arquivos provaveis envolvidos**: `app/admin/(protected)/page.tsx`, `src/features/products/*`, `src/components/admin/*`, possivelmente `src/types/*`.

**Passos de implementacao**:
- antes de implementar, ler obrigatoriamente:
  - `.codex/skills/tlc-spec-driven/SKILL.md`
  - `.codex/skills/tlc-spec-driven/references/implement.md`
  - `.codex/skills/tlc-spec-driven/references/coding-principles.md`
  - `specs/01-ideia.md`
  - `specs/02-spec.md`
  - `specs/03-design.md`
  - `specs/04-tasks.md`
- revisar o dashboard administrativo atual criado na T20
- criar uma consulta administrativa centralizada para metricas do dashboard, sem duplicar regras desnecessarias
- exibir total de produtos cadastrados
- exibir total de produtos publicados
- exibir total de produtos disponiveis
- exibir total de produtos visiveis no site
- exibir total de rascunhos
- exibir total de produtos arquivados
- exibir total de produtos em destaque
- exibir total de produtos sem imagem principal
- exibir alertas ou atalhos para itens que precisam de atencao, como rascunhos e produtos sem imagem principal
- manter os atalhos existentes para produtos e institucional
- garantir que as metricas considerem produtos arquivados, rascunhos e visibilidade de forma clara para o admin
- manter o dashboard responsivo em mobile e desktop
- preservar login, protecao admin, listagem, cadastro, upload, publicacao, arquivamento e configuracoes institucionais
- executar os gates `npx prisma validate`, `npm run typecheck`, `npm run lint` e `npm run build`

**Criterios de conclusao**:
- dashboard administrativo mostra metricas uteis para o vendedor
- total de produtos cadastrados aparece corretamente
- produtos publicados, disponiveis, visiveis, rascunhos, arquivados, destaques e sem imagem principal aparecem de forma clara
- cards/indicadores do dashboard sao responsivos
- atalhos administrativos continuam funcionando
- nenhuma regra de negocio de produto foi alterada
- fluxo publico continua funcionando sem alteracao
- todos os gates obrigatorios passam

**Testes manuais necessarios**:
- acessar `/admin` autenticado
- conferir os cards de metricas no dashboard
- criar ou editar produtos com status diferentes e confirmar reflexo nas metricas
- confirmar que rascunhos aparecem na metrica correta
- confirmar que arquivados aparecem na metrica correta
- confirmar que produtos sem imagem principal aparecem como alerta ou indicador
- abrir `/admin/produtos` e confirmar que a listagem continua funcionando
- abrir `/admin/institucional` e confirmar que configuracoes continuam funcionando
- abrir `/`, `/produtos` e `/produtos/[slug]` para confirmar que o publico nao quebrou
- testar responsividade basica do dashboard em mobile e desktop

**Dependencias**: T34

### T36 - Adicionar acoes rapidas com confirmacao na listagem de produtos

**Status**: Concluida

**Objetivo**: permitir que o administrador execute acoes comuns diretamente na listagem de produtos, como alterar status, visibilidade, destaque e arquivamento/restauracao, usando confirmacoes e feedback visual para evitar operacoes silenciosas ou acidentais.

**Arquivos provaveis envolvidos**: `app/admin/(protected)/produtos/page.tsx`, `src/components/admin/products-table.tsx`, `src/features/products/*`, `src/validators/products/*`, `src/components/admin/*`, possivelmente `src/components/ui/*`.

**Passos de implementacao**:
- antes de implementar, ler obrigatoriamente:
  - `.codex/skills/tlc-spec-driven/SKILL.md`
  - `.codex/skills/tlc-spec-driven/references/implement.md`
  - `.codex/skills/tlc-spec-driven/references/coding-principles.md`
  - `specs/01-ideia.md`
  - `specs/02-spec.md`
  - `specs/03-design.md`
  - `specs/04-tasks.md`
- revisar a listagem administrativa criada na T21
- revisar as server actions e regras de negocio de produto criadas nas T23, T29 e T30
- criar ou reutilizar server actions seguras para acoes rapidas
- permitir alterar status do produto diretamente na listagem, se estiver dentro das regras existentes
- permitir ativar/desativar visibilidade publica diretamente na listagem
- permitir marcar/remover destaque diretamente na listagem
- permitir arquivar/restaurar produto diretamente na listagem
- usar modal ou confirmacao clara para acoes sensiveis, como arquivar e restaurar
- usar o sistema de feedback/toast criado na T34 para sucesso, erro e validacao
- manter as acoes desabilitadas ou protegidas quando o produto nao cumprir regras de publicacao
- manter mensagens seguras sem vazar detalhes internos
- preservar filtros, busca e responsividade da listagem
- nao implementar exclusao definitiva de produto nesta task
- nao implementar exclusao de imagem nesta task
- nao alterar schema Prisma, migracoes, autenticacao, middleware/proxy ou regras publicas de visibilidade
- executar os gates `npx prisma validate`, `npm run typecheck`, `npm run lint` e `npm run build`

**Criterios de conclusao**:
- administrador consegue alterar status, visibilidade, destaque e arquivamento/restauracao sem abrir a tela de edicao do produto
- acoes sensiveis possuem confirmacao antes de executar
- acoes executadas com sucesso exibem feedback visual claro
- falhas de validacao ou erro inesperado exibem feedback visual seguro
- a listagem continua exibindo produtos de todos os estados administrativos
- rascunhos, arquivados e produtos invisiveis continuam respeitando as regras publicas existentes
- nenhuma exclusao definitiva de produto foi implementada
- fluxo publico continua funcionando sem alteracao
- todos os gates obrigatorios passam

**Testes manuais necessarios**:
- acessar `/admin/produtos` autenticado
- alterar visibilidade publica de um produto pela listagem e confirmar feedback
- marcar e remover destaque de um produto pela listagem e confirmar feedback
- alterar status quando permitido e confirmar reflexo na listagem
- arquivar produto pela listagem, confirmar modal/confirmacao e validar que ele sai do publico
- restaurar produto arquivado pela listagem, confirmar modal/confirmacao e validar comportamento
- tentar acao invalida quando aplicavel e confirmar toast de erro
- confirmar que busca e filtros da listagem continuam funcionando
- abrir `/produtos` e `/produtos/[slug]` para confirmar que regras publicas continuam corretas
- testar responsividade da listagem em mobile e desktop

**Dependencias**: T35

### T37 - Melhorar gerenciamento de imagens do produto

**Status**: Concluida

**Objetivo**: melhorar a galeria administrativa de imagens do produto, permitindo excluir imagens, trocar imagem principal com clareza e orientar o administrador quando uma ação puder afetar a exibição pública do produto.

**Arquivos provaveis envolvidos**: `src/components/admin/product-image-uploader.tsx`, `src/components/admin/product-image-gallery.tsx`, `src/components/admin/product-form.tsx`, `src/features/products/*`, `app/api/admin/uploads/route.ts`, possivelmente `src/components/ui/*`.

**Passos de implementacao**:
- antes de implementar, ler obrigatoriamente:
  - `.codex/skills/tlc-spec-driven/SKILL.md`
  - `.codex/skills/tlc-spec-driven/references/implement.md`
  - `.codex/skills/tlc-spec-driven/references/coding-principles.md`
  - `specs/01-ideia.md`
  - `specs/02-spec.md`
  - `specs/03-design.md`
  - `specs/04-tasks.md`
- revisar a estrutura atual de upload e galeria administrativa criada nas tasks anteriores
- revisar como `product_images` e `products.mainImageId` estao sendo persistidos
- permitir excluir imagem vinculada ao produto, respeitando integridade entre produto e imagens
- permitir trocar imagem principal de forma clara e segura
- destacar visualmente qual imagem e a principal
- mostrar aviso/confirmacao antes de excluir imagem
- se a imagem excluida for a principal, avisar que o produto pode deixar de aparecer publicamente se ficar sem imagem principal
- impedir que exclusao de imagem quebre a tela administrativa, catalogo publico ou pagina de detalhe
- preservar o limite de 8 imagens por produto
- preservar o upload existente
- usar o sistema de feedback/toast criado na T34 para sucesso, erro e validacao
- usar confirmacao/modal quando a acao for sensivel
- nao implementar reordenacao de imagens nesta task, a menos que ja exista estrutura segura e simples
- nao implementar exclusao definitiva de produto nesta task
- nao alterar schema Prisma, migracoes, autenticacao, middleware/proxy ou regras publicas de visibilidade
- executar os gates `npx prisma validate`, `npm run typecheck`, `npm run lint` e `npm run build`

**Criterios de conclusao**:
- administrador consegue visualizar claramente as imagens vinculadas ao produto
- imagem principal fica identificada visualmente
- administrador consegue trocar a imagem principal com feedback claro
- administrador consegue excluir uma imagem com confirmacao
- excluir imagem nao quebra o produto, o admin, o catalogo ou o detalhe publico
- se produto publicado ficar sem imagem principal, o comportamento continua respeitando a regra publica existente
- limite de 8 imagens continua funcionando
- upload existente continua funcionando
- nenhuma exclusao definitiva de produto foi implementada
- todos os gates obrigatorios passam

**Testes manuais necessarios**:
- acessar `/admin/produtos/[id]` autenticado
- enviar imagens validas ate o limite permitido
- confirmar que a imagem principal aparece destacada
- trocar imagem principal e confirmar feedback visual
- abrir `/produtos` e confirmar que o card usa a nova imagem principal
- abrir `/produtos/[slug]` e confirmar que a galeria usa as imagens corretas
- excluir uma imagem que nao e principal e confirmar que o produto continua funcionando
- tentar excluir a imagem principal e confirmar aviso/confirmacao
- confirmar que produto sem imagem principal nao aparece publicamente se essa for a regra vigente
- tentar exceder 8 imagens e confirmar erro controlado
- testar responsividade da galeria administrativa em mobile e desktop

**Dependencias**: T36


### T38 - Implementar exclusao segura de produto e revisao final das melhorias

**Status**: Concluida

**Objetivo**: adicionar um fluxo seguro para exclusao de produto no painel administrativo, com confirmacao forte antes da acao, preservando a integridade de imagens, regras publicas e dados administrativos, e validar todo o sistema apos as melhorias de usabilidade.

**Arquivos provaveis envolvidos**: `src/components/admin/product-form.tsx`, `src/components/admin/products-table.tsx`, `src/features/products/*`, `app/admin/(protected)/produtos/*`, `src/components/ui/*`, `src/lib/*`, possivelmente `app/api/admin/*`.

**Passos de implementacao**:
- antes de implementar, ler obrigatoriamente:
  - `.codex/skills/tlc-spec-driven/SKILL.md`
  - `.codex/skills/tlc-spec-driven/references/implement.md`
  - `.codex/skills/tlc-spec-driven/references/coding-principles.md`
  - `specs/01-ideia.md`
  - `specs/02-spec.md`
  - `specs/03-design.md`
  - `specs/04-tasks.md`
- revisar o fluxo atual de produtos criado nas tasks anteriores
- revisar criacao, edicao, publicacao, arquivamento, upload, imagem principal e acoes rapidas
- definir o comportamento mais seguro para exclusao de produto
- adicionar botao de excluir produto onde fizer sentido no admin, como tela de edicao e/ou listagem
- criar modal de confirmacao forte antes de excluir
- deixar claro que a acao e sensivel e pode nao ser reversivel
- se a exclusao for definitiva, exigir confirmacao explicita, como digitar `EXCLUIR`
- se a exclusao definitiva for arriscada por causa de imagens no Storage ou integridade do banco, implementar apenas o fluxo seguro possivel e registrar recomendacao para uma etapa futura
- garantir que produto excluido nao apareca no admin nem no publico, conforme regra definida na implementacao segura
- garantir que produto arquivado continue funcionando como alternativa segura quando exclusao definitiva nao for apropriada
- tratar imagens vinculadas ao produto com cuidado, sem deixar o sistema quebrado
- usar o sistema de feedback/toast criado na T34 para sucesso, erro e falha inesperada
- usar modal/confirmacao para qualquer acao destrutiva
- preservar as melhorias da T35, T36 e T37
- fazer revisao final das melhorias administrativas recentes
- validar que dashboard, acoes rapidas, imagens, feedback visual e exclusao segura funcionam em conjunto
- nao alterar schema Prisma, a menos que seja absolutamente necessario e previamente justificado
- nao criar migracao sem necessidade comprovada
- nao alterar autenticacao, middleware/proxy ou regras publicas de visibilidade
- nao expor segredos, tokens ou valores reais do `.env`
- executar os gates `npx prisma validate`, `npm run typecheck`, `npm run lint` e `npm run build`

**Criterios de conclusao**:
- existe um fluxo seguro para exclusao ou remocao controlada de produto
- a acao de excluir possui modal de confirmacao forte
- usuario entende claramente o risco antes de confirmar
- acao destrutiva nao ocorre por clique acidental
- feedback visual aparece em sucesso, erro e falha inesperada
- produto removido nao quebra listagem admin, catalogo publico, detalhe publico, imagens ou dashboard
- imagens vinculadas ao produto sao tratadas de forma segura conforme a estrategia escolhida
- se exclusao definitiva nao for segura nesta etapa, a limitacao foi registrada claramente como recomendacao
- dashboard, notificacoes, acoes rapidas e gerenciamento de imagens continuam funcionando
- fluxo publico continua funcionando sem alteracao indesejada
- fluxo administrativo continua funcionando sem regressao
- todos os gates obrigatorios passam

**Testes manuais necessarios**:
- acessar `/admin/produtos` autenticado
- abrir um produto existente em `/admin/produtos/[id]`
- verificar se o botao de excluir/remover aparece somente onde fizer sentido
- clicar em excluir e confirmar que modal de aviso aparece
- cancelar a exclusao e confirmar que nada foi alterado
- confirmar a exclusao seguindo a regra definida, como digitar `EXCLUIR` se implementado
- validar feedback visual de sucesso ou erro
- confirmar que o produto removido nao aparece onde nao deveria aparecer
- confirmar que catalogo publico `/produtos` continua funcionando
- confirmar que detalhe `/produtos/[slug]` de produto removido ou indisponivel nao quebra
- confirmar que dashboard administrativo continua carregando metricas corretamente
- confirmar que acoes rapidas da listagem continuam funcionando
- confirmar que upload, troca de imagem principal e exclusao de imagem continuam funcionando
- confirmar que `/admin/institucional` continua funcionando
- testar responsividade basica em mobile e desktop
- rodar o fluxo final: criar rascunho, adicionar imagem, publicar, alterar status/visibilidade, arquivar/restaurar e remover/excluir conforme implementado

**Dependencias**: T37

### T39 - Preparar documentacao, checklist final e entrega do sistema

**Status**: Concluida

**Objetivo**: documentar a configuracao, variaveis de ambiente, fluxo de uso e checklist final do AgroMassa para facilitar manutencao, deploy e futuras evolucoes, garantindo que o sistema esteja pronto para entrega sem alterar funcionalidades ja validadas.

**Arquivos provaveis envolvidos**: `README.md`, `.env.example`, `docs/*`, `specs/04-tasks.md`, possivelmente arquivos de configuracao apenas se houver erro documentado e seguro para corrigir.

**Passos de implementacao**:
- antes de implementar, ler obrigatoriamente:
  - `.codex/skills/tlc-spec-driven/SKILL.md`
  - `.codex/skills/tlc-spec-driven/references/implement.md`
  - `.codex/skills/tlc-spec-driven/references/coding-principles.md`
  - `specs/01-ideia.md`
  - `specs/02-spec.md`
  - `specs/03-design.md`
  - `specs/04-tasks.md`
- revisar o estado atual do sistema apos as melhorias da Fase 14
- criar ou atualizar documentacao de setup local
- documentar variaveis de ambiente necessarias, sem valores reais
- reforcar que `NEXT_PUBLIC_SUPABASE_URL` deve usar a URL base do projeto Supabase, sem `/rest/v1`
- documentar configuracao do Supabase Storage e bucket de imagens
- documentar como rodar seed, validacoes, build e servidor local
- criar checklist manual final do MVP
- documentar fluxo administrativo principal:
  - login
  - dashboard
  - cadastro de produto
  - upload de imagem
  - publicacao
  - acoes rapidas
  - gerenciamento de imagens
  - arquivamento/exclusao segura
  - configuracoes institucionais
- documentar fluxo publico principal:
  - home
  - catalogo
  - filtros
  - carregar mais
  - detalhe do produto
  - galeria
  - WhatsApp
- revisar `.env.example` para garantir que todas as variaveis necessarias estejam documentadas
- nao colocar segredos, tokens, URLs sensiveis reais, senhas ou chaves privadas em arquivos versionados
- nao alterar regras de negocio
- nao alterar schema Prisma
- nao criar migracao
- nao alterar autenticacao, middleware/proxy, upload ou fluxos administrativos
- corrigir apenas pequenos erros de documentacao/configuracao se forem claros e seguros
- executar os gates `npx prisma validate`, `npm run typecheck`, `npm run lint` e `npm run build`

**Criterios de conclusao**:
- existe documentacao clara para rodar o projeto localmente
- `.env.example` lista todas as variaveis necessarias sem valores reais
- configuracao do Supabase Storage esta documentada
- checklist final do MVP esta documentado
- fluxo publico e fluxo administrativo estao descritos de forma objetiva
- nao houve alteracao funcional fora de documentacao/configuracao segura
- nenhum segredo foi exposto
- todos os gates obrigatorios passam

**Testes manuais necessarios**:
- seguir a documentacao localmente em uma instalacao limpa ou revisao simulada
- conferir se `.env.example` possui todas as variaveis usadas pelo sistema
- rodar `npx prisma validate`
- rodar `npm run typecheck`
- rodar `npm run lint`
- rodar `npm run build`
- abrir `/`, `/produtos` e `/produtos/[slug]`
- abrir `/admin/login`, fazer login e validar `/admin`
- validar cadastro, edicao, upload, publicacao, acoes rapidas, imagens, exclusao/arquivamento e configuracoes institucionais
- confirmar que nenhum arquivo versionado contem segredo real

**Dependencias**: T38

## Fase 15. Otimizacao de performance, estabilidade e resposta visual

- [x] T40. Criar baseline de performance e validacao de seguranca

  **Objetivo:**  
  Registrar o estado atual do AgroMassa antes de qualquer otimizacao, garantindo que as proximas tasks sejam aplicadas com seguranca, sem quebrar funcionalidades existentes.

  **Motivo:**  
  Antes de alterar consultas, imagens, cache, componentes ou banco de dados, e necessario saber se o projeto ja esta compilando corretamente e quais telas apresentam lentidao ou delay. Essa task cria uma referencia inicial para comparar as melhorias das proximas tasks.

  **Escopo permitido:**  
  - Rodar validacoes do projeto.
  - Testar manualmente as principais telas.
  - Registrar problemas encontrados.
  - Criar um arquivo simples de baseline/documentacao, se necessario.

  **Escopo proibido:**  
  - Nao otimizar codigo ainda.
  - Nao alterar regra de negocio.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao alterar componentes visuais, exceto se for necessario apenas para corrigir erro impeditivo de build, e nesse caso documentar claramente.

  **Arquivos provaveis:**  
  - `specs/04-tasks.md`
  - `specs/performance-baseline.md`, caso ainda nao exista

  **Passos de implementacao:**

  1. Verificar se o projeto instala e executa corretamente.

     Rodar:

     ```bash
     npm install
     ```

     ou, se o ambiente estiver limpo e houver `package-lock.json` confiavel:

     ```bash
     npm ci
     ```

  2. Rodar as validacoes principais do projeto:

     ```bash
     npm run prisma:validate
     npm run typecheck
     npm run lint
     npm run build
     ```

     Caso algum script nao exista no `package.json`, nao criar script novo nesta task. Apenas registrar no baseline qual comando nao existe.

  3. Subir o projeto localmente:

     ```bash
     npm run dev
     ```

  4. Testar manualmente as seguintes rotas publicas:

     ```txt
     /
     /produtos
     /produtos?page=2
     ```

     Registrar:

     - se a pagina abriu corretamente;
     - se houve erro no console;
     - se houve demora perceptivel;
     - se imagens carregaram corretamente;
     - se o botao de carregar mais funcionou;
     - se busca/filtros continuaram funcionando, quando aplicavel.

  5. Testar manualmente as seguintes rotas administrativas:

     ```txt
     /admin
     /admin/produtos
     ```

     Registrar:

     - tempo percebido de abertura;
     - delay ao clicar em acoes rapidas;
     - se a tabela carrega corretamente;
     - se status, destaque, visibilidade e arquivamento funcionam;
     - se ha refresh excessivo ou travamento apos clique.

  6. Testar fluxo de produto, se o ambiente tiver dados e acesso admin:

     ```txt
     criar produto
     editar produto
     enviar imagem
     definir imagem principal
     publicar/despublicar produto
     arquivar/restaurar produto
     ```

     Nao corrigir problemas nesta task, apenas registrar.

  7. Criar ou atualizar o arquivo:

     ```txt
     specs/performance-baseline.md
     ```

     Com este formato:

     ```md
     # Baseline de performance - AgroMassa

     Data da verificacao: YYYY-MM-DD

     ## Ambiente

     - Node:
     - npm:
     - Banco usado:
     - Sistema operacional:
     - Branch:

     ## Validacoes automaticas

     | Comando | Resultado | Observacoes |
     | ------- | --------- | ----------- |
     | npm run prisma:validate | pendente/aprovado/falhou | |
     | npm run typecheck | pendente/aprovado/falhou | |
     | npm run lint | pendente/aprovado/falhou | |
     | npm run build | pendente/aprovado/falhou | |

     ## Rotas publicas testadas

     | Rota | Resultado | Observacoes |
     | ---- | --------- | ----------- |
     | / | | |
     | /produtos | | |
     | /produtos?page=2 | | |

     ## Rotas admin testadas

     | Rota | Resultado | Observacoes |
     | ---- | --------- | ----------- |
     | /admin | | |
     | /admin/produtos | | |

     ## Pontos de lentidao percebidos

     - 

     ## Erros encontrados no console

     - 

     ## Riscos antes das otimizacoes

     - 

     ## Observacoes para as proximas tasks

     - 
     ```

  8. No final, marcar a task T40 como concluida somente se:

     - o baseline foi criado ou atualizado;
     - os comandos disponiveis foram executados;
     - os erros encontrados foram registrados;
     - nenhuma otimizacao fora do escopo foi feita.

  **Criterios de aceite:**

  - Existe um registro claro do estado atual do sistema antes das otimizacoes.
  - As validacoes automaticas foram executadas ou tiveram ausencia registrada.
  - As principais rotas publicas e administrativas foram verificadas.
  - Problemas encontrados foram documentados sem tentar corrigir tudo nesta task.
  - Nenhuma regra de negocio foi alterada.
  - Nenhuma migration foi criada.
  - Nenhuma otimizacao de performance foi implementada ainda.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build

- [ ] T41. Otimizar imagens dos produtos e URLs do Supabase

  **Objetivo:**  
  Melhorar o carregamento das imagens dos produtos e reduzir chamadas desnecessarias ao Supabase, deixando o catalogo publico e as listagens mais rapidas sem alterar a regra de negocio do sistema.

  **Motivo:**  
  Atualmente as imagens dos produtos podem estar sendo renderizadas de forma pouco otimizada, usando `background-image`, o que impede o Next.js de aplicar otimizacoes automaticas como lazy loading, formatos modernos e redimensionamento responsivo.  
  Alem disso, se o sistema gerar uma URL assinada do Supabase para cada imagem exibida em listagens, cada carregamento de pagina pode fazer chamadas extras desnecessarias, aumentando o delay.

  **Escopo permitido:**  
  - Configurar otimizacao de imagens no `next.config.ts`.
  - Trocar renderizacao de imagem publica de produto para `next/image`.
  - Manter fallback visual para imagem padrao do AgroMassa.
  - Revisar a funcao que gera URL de exibicao das imagens no Supabase.
  - Evitar chamadas desnecessarias de `createSignedUrl` quando `publicUrl` ja for suficiente.
  - Preservar compatibilidade com imagens existentes.

  **Escopo proibido:**  
  - Nao alterar fluxo de upload de imagem nesta task.
  - Nao adicionar compressao com `sharp` nesta task.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao alterar regras de produto, publicacao, destaque ou arquivamento.
  - Nao mexer na paginação do catalogo ainda.
  - Nao alterar layout geral das paginas fora do necessario para adaptar o componente de imagem.

  **Arquivos provaveis:**  
  - `next.config.ts`
  - `src/components/public/product-card-image.tsx`
  - `src/components/public/product-card.tsx`
  - `src/lib/storage/supabase-storage.ts`
  - `src/features/products/public-list-products.ts`, somente se necessario
  - `src/features/products/admin-list-products.ts`, somente se necessario

  **Passos de implementacao:**

  1. Revisar como as imagens de produtos sao exibidas atualmente.

     Verificar principalmente:

     ```txt
     src/components/public/product-card-image.tsx
     src/components/public/product-card.tsx
     ```

     Identificar se a imagem esta sendo renderizada com `backgroundImage`, `img` comum ou outro metodo.

  2. Configurar `next.config.ts` para permitir imagens remotas do Supabase.

     Usar `NEXT_PUBLIC_SUPABASE_URL` para extrair o hostname do Supabase, evitando deixar dominio fixo no codigo.

     Exemplo esperado:

     ```ts
     import type { NextConfig } from "next";

     const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
       ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
       : undefined;

     const nextConfig: NextConfig = {
       images: {
         formats: ["image/avif", "image/webp"],
         minimumCacheTTL: 60 * 60 * 24,
         remotePatterns: supabaseHost
           ? [
               {
                 protocol: "https",
                 hostname: supabaseHost,
                 pathname: "/storage/v1/object/**",
               },
             ]
           : [],
       },
     };

     export default nextConfig;
     ```

     Se o arquivo ja tiver configuracoes existentes, preservar todas elas e adicionar apenas a parte de `images`.

  3. Trocar o componente publico de imagem do produto para usar `next/image`.

     O componente deve:

     - usar `Image` de `next/image`;
     - manter `alt`;
     - manter fallback para `/brand/agromassa1.jpeg`;
     - usar `fill`, `sizes` e `object-cover`;
     - preservar o efeito visual atual, se houver hover/scale;
     - evitar quebrar cards existentes.

     Exemplo de direcao:

     ```tsx
     import Image from "next/image";

     type ProductCardImageProps = {
       alt: string;
       src: string | null | undefined;
       priority?: boolean;
       sizes?: string;
     };

     export function ProductCardImage({
       alt,
       src,
       priority = false,
       sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
     }: ProductCardImageProps) {
       return (
         <Image
           alt={alt}
           className="object-cover transition duration-300 group-hover:scale-[1.03]"
           fill
           priority={priority}
           sizes={sizes}
           src={src || "/brand/agromassa1.jpeg"}
         />
       );
     }
     ```

     O componente pai deve garantir que o wrapper da imagem tenha:

     ```tsx
     className="relative ..."
     ```

     porque `Image` com `fill` precisa de container relativo.

  4. Revisar a funcao de URL de exibicao da imagem no Supabase.

     Verificar:

     ```txt
     src/lib/storage/supabase-storage.ts
     ```

     Procurar a funcao responsavel por montar ou assinar URL de imagem, provavelmente algo semelhante a:

     ```ts
     getProductImageDisplayUrl()
     ```

     Se a imagem ja tiver `publicUrl` confiavel, evitar chamar `createSignedUrl` para cada item de listagem.

     A direcao preferida e:

     ```ts
     export function getProductImageDisplayUrl({
       publicUrl,
     }: {
       publicUrl: string;
       storageKey: string;
     }) {
       return publicUrl;
     }
     ```

     Porem, antes de aplicar, verificar se o projeto depende de bucket privado.

  5. Se o bucket parecer privado ou se `publicUrl` nao for suficiente, nao remover a assinatura de forma arriscada.

     Nesse caso, aplicar uma solucao segura:

     - manter comportamento atual;
     - documentar no final que a remocao de URL assinada depende de confirmar se o bucket e publico;
     - nao quebrar exibicao das imagens.

  6. Garantir que as imagens continuem aparecendo nestes lugares:

     ```txt
     /
     /produtos
     /produtos/[slug]
     /admin/produtos
     ```

     Se a task alterar somente imagem publica, ainda assim verificar se o admin nao foi afetado.

  7. Garantir que imagens ausentes continuem usando fallback:

     ```txt
     /brand/agromassa1.jpeg
     ```

  8. Rodar validacoes obrigatorias:

     ```bash
     npm run prisma:validate
     npm run typecheck
     npm run lint
     npm run build
     ```

  9. Atualizar o checklist da T41 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - Imagens de produtos no catalogo publico usam `next/image`.
  - O `next.config.ts` permite imagens remotas do Supabase sem hardcode desnecessario.
  - O fallback `/brand/agromassa1.jpeg` continua funcionando.
  - O layout dos cards de produto nao fica quebrado.
  - A exibicao de imagens existentes continua funcionando.
  - Chamadas desnecessarias ao Supabase para gerar URL assinada foram removidas quando for seguro.
  - Se nao for seguro remover `createSignedUrl`, isso foi documentado claramente.
  - Nenhuma regra de negocio de produto foi alterada.
  - Nenhuma migration foi criada.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build

- [ ] T42. Otimizar carregamento do catalogo publico

  **Objetivo:**  
  Otimizar o carregamento da pagina publica de produtos, evitando que o catalogo busque cada vez mais registros no banco conforme o usuario clica em "Carregar mais", mantendo a experiencia atual do usuario e sem alterar regras de negocio.

  **Motivo:**  
  A listagem publica de produtos pode estar usando uma estrategia acumulativa baseada em `page * pageSize`. Isso faz com que paginas mais avancadas busquem muitos produtos de uma vez, mesmo quando o usuario so precisa carregar a proxima leva.  
  Esse comportamento aumenta o tempo de resposta do banco, deixa o carregamento mais pesado e pode causar delay perceptivel no catalogo.

  **Escopo permitido:**  
  - Corrigir a consulta publica de produtos para usar paginacao real.
  - Buscar somente a proxima pagina de produtos.
  - Preservar o botao "Carregar mais".
  - Preservar filtros e busca da pagina `/produtos`.
  - Criar um endpoint publico seguro para carregar mais produtos, se necessario.
  - Criar ou ajustar componente client apenas para anexar os novos produtos carregados.
  - Manter ordenacao atual dos produtos.
  - Manter regras atuais de visibilidade publica dos produtos.

  **Escopo proibido:**  
  - Nao alterar regras de publicacao de produto.
  - Nao alterar regras de destaque.
  - Nao alterar regras de arquivamento.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao mexer em listagem admin nesta task.
  - Nao alterar upload de imagens.
  - Nao alterar cache global ou `force-dynamic` nesta task.
  - Nao remover filtros ou busca existentes.
  - Nao trocar o layout geral do catalogo.

  **Arquivos provaveis:**  
  - `src/features/products/public-list-products.ts`
  - `app/(public)/produtos/page.tsx`
  - `src/components/public/load-more-button.tsx`
  - `src/components/public/product-card.tsx`, somente se necessario
  - `app/api/public/products/route.ts`, se for necessario criar endpoint para carregar mais produtos
  - `src/components/public/public-products-list.tsx`, se for necessario criar componente client para anexar novos produtos

  **Passos de implementacao:**

  1. Revisar a implementacao atual da listagem publica.

     Verificar principalmente:

     ```txt
     src/features/products/public-list-products.ts
     app/(public)/produtos/page.tsx
     src/components/public/load-more-button.tsx
     ```

     Procurar se existe logica parecida com:

     ```ts
     const visibleLimit = page * pageSize;
     ```

     ou:

     ```ts
     take: visibleLimit + 1
     ```

  2. Substituir a estrategia acumulativa por paginacao real.

     A funcao de listagem deve buscar somente a pagina solicitada.

     Direcao esperada:

     ```ts
     const page = Math.max(filters.page, 1);
     const skip = (page - 1) * pageSize;

     const products = await prisma.product.findMany({
       where: buildPublicProductWhere(filters),
       orderBy: [
         { isFeatured: "desc" },
         { createdAt: "desc" },
         { id: "desc" },
       ],
       select: publicProductListSelect,
       skip,
       take: pageSize + 1,
     });
     ```

     O retorno deve continuar informando:

     ```ts
     {
       products,
       page,
       pageSize,
       hasMore,
       nextPage
     }
     ```

     Onde:

     ```ts
     hasMore = products.length > pageSize;
     nextPage = hasMore ? page + 1 : null;
     ```

  3. Preservar o comportamento visual do botao "Carregar mais".

     O usuario nao deve sentir que a pagina "troca" ou perde produtos ja carregados.

     A solucao preferida e:

     - renderizar a primeira pagina no servidor;
     - transformar o carregamento adicional em comportamento client;
     - ao clicar em "Carregar mais", buscar somente a proxima pagina;
     - anexar os novos produtos a lista existente;
     - atualizar estado de carregamento do botao;
     - esconder o botao quando `hasMore` for falso.

  4. Se for necessario criar endpoint publico, criar um endpoint limitado e seguro.

     Caminho sugerido:

     ```txt
     app/api/public/products/route.ts
     ```

     Esse endpoint deve:

     - aceitar os mesmos filtros publicos da pagina `/produtos`;
     - aceitar `page`;
     - limitar `pageSize` internamente;
     - nunca retornar produtos que nao estejam publicamente visiveis;
     - reutilizar a funcao de listagem publica existente;
     - retornar JSON somente com os dados necessarios para os cards.

     Exemplo de comportamento esperado:

     ```txt
     GET /api/public/products?page=2&q=tomate&category=...
     ```

  5. Se for criado componente client para a lista, manter a menor area client possivel.

     Exemplo de separacao esperada:

     ```txt
     app/(public)/produtos/page.tsx              -> server component
     src/components/public/public-products-list.tsx -> client component pequeno
     src/components/public/product-card.tsx      -> manter como esta, se possivel
     ```

     O componente client deve cuidar apenas de:

     - armazenar produtos carregados;
     - chamar o endpoint;
     - anexar novos produtos;
     - controlar loading;
     - controlar erro simples;
     - controlar `hasMore` e `nextPage`.

  6. Preservar filtros e busca.

     Ao clicar em "Carregar mais", a requisicao deve manter os parametros atuais da URL, como:

     ```txt
     q
     category
     cidade
     status
     page
     ```

     Usar somente os parametros que realmente existirem no projeto.  
     Nao inventar filtro novo nesta task.

  7. Garantir que a ordenacao continue consistente.

     A ordenacao deve permanecer equivalente a atual, por exemplo:

     ```ts
     orderBy: [
       { isFeatured: "desc" },
       { createdAt: "desc" },
       { id: "desc" },
     ]
     ```

     O `id` no final ajuda a manter ordenacao estavel quando datas forem iguais.

  8. Garantir que a primeira renderizacao da pagina continue funcionando sem JavaScript.

     A pagina `/produtos` deve continuar exibindo a primeira leva de produtos mesmo antes de qualquer clique em "Carregar mais".

  9. Tratar estados basicos do botao.

     O botao deve ter comportamento seguro:

     - desabilitado durante carregamento;
     - texto de carregamento enquanto busca;
     - mensagem simples se falhar;
     - nao duplicar produtos se o usuario clicar varias vezes;
     - nao buscar pagina inexistente se `hasMore` for falso.

  10. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  11. Atualizar o checklist da T42 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - A listagem publica nao usa mais `page * pageSize` para buscar resultados acumulados no banco.
  - A consulta publica usa `skip` e `take` ou estrategia equivalente de paginacao real.
  - A primeira pagina de `/produtos` continua carregando corretamente.
  - O botao "Carregar mais" continua funcionando.
  - Ao clicar em "Carregar mais", os produtos ja exibidos permanecem na tela.
  - A proxima pagina carrega somente os novos produtos.
  - Filtros e busca existentes continuam funcionando.
  - Produtos nao publicos, arquivados ou em rascunho nao aparecem no catalogo.
  - Nao ha produtos duplicados ao carregar mais.
  - O layout visual do catalogo nao foi refeito sem necessidade.
  - Nenhuma regra de negocio foi alterada.
  - Nenhuma migration foi criada.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build



- [ ] T43. Criar paginacao real na listagem admin de produtos

  **Objetivo:**  
  Otimizar a pagina `/admin/produtos`, evitando que o admin carregue todos os produtos de uma vez. A listagem deve passar a usar paginacao real no banco, mantendo busca, tabela, acoes rapidas e comportamento administrativo existentes.

  **Motivo:**  
  A listagem administrativa de produtos tende a ficar lenta conforme a quantidade de produtos cresce. Se o sistema usa `findMany()` sem `take` e `skip`, todos os produtos sao carregados de uma vez, enviados para a pagina e hidratados no navegador.  
  Isso aumenta o tempo de carregamento, deixa a tabela pesada e pode causar delay nas interacoes.

  **Escopo permitido:**  
  - Adicionar paginacao real no servico de listagem admin.
  - Usar `skip` e `take` no Prisma.
  - Retornar metadados de paginacao, como `total`, `page`, `pageSize` e `totalPages`.
  - Preservar busca existente por `q`, se houver.
  - Atualizar a pagina `/admin/produtos` para ler `page` pela URL.
  - Criar componente simples de paginacao admin, se necessario.
  - Preservar a tabela atual e suas acoes.
  - Preservar ordenacao atual da listagem.
  - Preservar filtros existentes, caso existam.

  **Escopo proibido:**  
  - Nao alterar regras de cadastro de produto.
  - Nao alterar regras de edicao de produto.
  - Nao alterar regras de publicacao, destaque, visibilidade ou arquivamento.
  - Nao alterar upload de imagens.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao mexer no catalogo publico nesta task.
  - Nao remover `router.refresh()` das acoes rapidas nesta task.
  - Nao dividir a tabela em Server Component e Client Component nesta task.
  - Nao alterar cache ou `force-dynamic` nesta task.
  - Nao refatorar layout geral do admin sem necessidade.

  **Arquivos provaveis:**  
  - `src/features/products/admin-list-products.ts`
  - `app/admin/(protected)/produtos/page.tsx`
  - `src/components/admin/products-table.tsx`, somente se necessario para adaptar props
  - `src/components/admin/admin-pagination.tsx`, se for necessario criar componente de paginacao
  - `src/components/admin/products-search.tsx`, somente se existir e for necessario preservar `q`

  **Passos de implementacao:**

  1. Revisar a implementacao atual da listagem admin.

     Verificar principalmente:

     ```txt
     src/features/products/admin-list-products.ts
     app/admin/(protected)/produtos/page.tsx
     src/components/admin/products-table.tsx
     ```

     Procurar se o servico admin usa `findMany()` sem:

     ```ts
     skip
     take
     ```

     Confirmar tambem se existe busca por `q`, filtro de status ou algum parametro ja usado na URL.

  2. Alterar o servico `adminListProducts` para receber parametros de paginacao.

     A funcao deve aceitar, no minimo:

     ```ts
     {
       page?: number;
       pageSize?: number;
       q?: string;
     }
     ```

     Usar nomes reais do projeto se ja existir um tipo definido.

     Definir um tamanho padrao seguro:

     ```ts
     const ADMIN_PRODUCTS_PAGE_SIZE = 20;
     ```

     Limitar `pageSize` para evitar abuso ou carregamento excessivo.

     Exemplo de direcao:

     ```ts
     const page = Math.max(filters.page ?? 1, 1);
     const pageSize = Math.min(
       Math.max(filters.pageSize ?? ADMIN_PRODUCTS_PAGE_SIZE, 1),
       50,
     );

     const skip = (page - 1) * pageSize;
     ```

  3. Preservar a busca existente.

     Se a listagem admin ja usa `q`, manter a mesma regra de busca.

     Se o projeto usa campo normalizado como:

     ```txt
     searchTextNormalized
     ```

     continuar usando esse campo, sem trocar a regra de busca por outra diferente.

     Nao inventar filtros novos nesta task.

  4. Usar `count` e `findMany` com o mesmo `where`.

     O servico deve retornar a quantidade total de produtos que correspondem aos filtros atuais.

     Direcao esperada:

     ```ts
     const [total, products] = await prisma.$transaction([
       prisma.product.count({ where }),
       prisma.product.findMany({
         where,
         orderBy: [
           { updatedAt: "desc" },
           { createdAt: "desc" },
           { id: "desc" },
         ],
         select: adminProductListSelect,
         skip,
         take: pageSize,
       }),
     ]);
     ```

     Se a ordenacao atual for diferente, preservar a ordenacao atual e apenas adicionar `id` como ultimo criterio se isso for seguro.

  5. Retornar metadados de paginacao.

     O retorno deve ter formato semelhante a:

     ```ts
     return {
       products,
       total,
       page,
       pageSize,
       totalPages: Math.max(Math.ceil(total / pageSize), 1),
     };
     ```

     Se nao houver produtos, o retorno deve ser seguro e nao quebrar a tela.

  6. Atualizar `/admin/produtos` para ler `page` da URL.

     A pagina deve aceitar parametro:

     ```txt
     ?page=1
     ```

     E preservar busca existente:

     ```txt
     ?q=texto&page=2
     ```

     Regras:

     - se `page` nao existir, usar `1`;
     - se `page` for invalido, usar `1`;
     - se `q` existir, manter na navegacao de paginas;
     - nao perder filtros existentes ao clicar em anterior/proxima.

  7. Criar paginacao simples, se o projeto ainda nao tiver componente para isso.

     Caminho sugerido:

     ```txt
     src/components/admin/admin-pagination.tsx
     ```

     O componente deve ser simples e seguro:

     - usar `Link` do Next.js;
     - receber `page`, `totalPages`, `total`, `pageSize` e parametros atuais;
     - exibir pagina atual;
     - ter botao/link "Anterior";
     - ter botao/link "Proxima";
     - desabilitar ou ocultar "Anterior" na primeira pagina;
     - desabilitar ou ocultar "Proxima" na ultima pagina;
     - preservar `q` e demais parametros existentes.

     Nao criar paginacao complexa com muitas paginas nesta task, a menos que seja muito simples e seguro.

  8. Atualizar a tabela somente se necessario.

     Se `ProductsTable` espera apenas `products`, manter assim.

     Se for necessario exibir total ou estado vazio, fazer a menor alteracao possivel.

     Nao mover logica de acoes rapidas nesta task.

     Nao alterar comportamento de:

     ```txt
     status
     destaque
     visibilidade publica
     arquivar
     restaurar
     excluir
     editar
     ```

  9. Garantir estado vazio seguro.

     Se a busca nao retornar produtos, a tela deve continuar mostrando mensagem adequada de vazio.

     Se a pagina atual nao tiver produtos por causa de parametro alto demais, nao quebrar. Pode mostrar estado vazio ou orientar o usuario a voltar para a primeira pagina.

  10. Garantir que a busca continue funcionando com paginacao.

      Testar cenarios:

      ```txt
      /admin/produtos?q=abc
      /admin/produtos?q=abc&page=2
      ```

      Ao trocar busca, a pagina deve preferencialmente voltar para `page=1`, se o componente de busca permitir isso com seguranca.

  11. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  12. Atualizar o checklist da T43 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - A listagem admin nao carrega mais todos os produtos de uma vez.
  - O servico admin usa `skip` e `take` ou estrategia equivalente de paginacao real.
  - O servico retorna `products`, `total`, `page`, `pageSize` e `totalPages`, ou estrutura equivalente.
  - A pagina `/admin/produtos` aceita `page` pela URL.
  - A navegacao anterior/proxima funciona.
  - A busca existente por `q` continua funcionando.
  - A paginacao preserva a busca e filtros existentes.
  - A tabela de produtos continua exibindo os dados corretamente.
  - As acoes rapidas existentes continuam funcionando como antes.
  - Nenhuma regra de negocio de produto foi alterada.
  - Nenhuma migration foi criada.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build

  - [ ] T44. Reduzir delay das acoes rapidas do admin

  **Objetivo:**  
  Reduzir o delay percebido ao clicar nas acoes rapidas da tabela administrativa de produtos, mantendo o comportamento atual, a seguranca das operacoes e a consistencia visual da interface.

  **Motivo:**  
  A tabela administrativa pode estar hidratando mais JavaScript do que o necessario e algumas acoes podem estar chamando `router.refresh()` de forma excessiva. Isso pode causar sensacao de travamento, delay apos clique ou recarregamento desnecessario da pagina inteira.  
  Esta task deve deixar as acoes mais responsivas, sem alterar regras de negocio.

  **Escopo permitido:**  
  - Melhorar a resposta visual das acoes rapidas do admin.
  - Manter atualizacao otimista quando ela ja existir ou for segura.
  - Reduzir ou remover `router.refresh()` apenas quando nao for necessario.
  - Manter rollback em caso de erro.
  - Separar partes estaticas da tabela de partes interativas, se isso puder ser feito com seguranca.
  - Criar componente client pequeno apenas para controles interativos.
  - Manter toasts de sucesso e erro.
  - Preservar acessibilidade basica dos botoes e selects.

  **Escopo proibido:**  
  - Nao alterar regras de negocio dos produtos.
  - Nao alterar regras de publicacao.
  - Nao alterar regras de destaque.
  - Nao alterar regras de visibilidade publica.
  - Nao alterar regras de arquivamento ou restauracao.
  - Nao alterar upload de imagens.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao mexer no catalogo publico nesta task.
  - Nao mexer em cache publico ou `force-dynamic` nesta task.
  - Nao refatorar todo o admin sem necessidade.
  - Nao alterar a paginacao criada na T43, exceto se for necessario apenas para preservar funcionamento.

  **Arquivos provaveis:**  
  - `src/components/admin/products-table.tsx`
  - `src/components/admin/product-quick-action-controls.tsx`, se for criado novo componente
  - `src/features/products/actions.ts`, somente se necessario entender retornos das actions
  - `app/admin/(protected)/produtos/page.tsx`, somente se necessario ajustar import ou props

  **Passos de implementacao:**

  1. Revisar a tabela administrativa atual.

     Verificar principalmente:

     ```txt
     src/components/admin/products-table.tsx
     ```

     Identificar:

     - se o arquivo inteiro esta marcado com `"use client"`;
     - quais partes realmente precisam ser client;
     - quais botoes ou controles chamam server actions;
     - onde existe `router.refresh()`;
     - se ja existe atualizacao otimista;
     - se existe rollback quando a action falha.

  2. Mapear as acoes rapidas existentes.

     Antes de alterar, listar mentalmente ou em comentario temporario removido depois quais acoes existem, por exemplo:

     ```txt
     alterar status
     destacar/remover destaque
     publicar/despublicar
     arquivar/restaurar
     excluir
     editar
     ```

     Usar apenas as acoes que realmente existem no projeto.

  3. Preservar o contrato atual das server actions.

     Verificar retornos das actions em:

     ```txt
     src/features/products/actions.ts
     ```

     Nao alterar a regra interna das actions nesta task.

     So ajustar chamada no componente se for necessario para melhorar estado visual, loading ou rollback.

  4. Reduzir a area client da tabela somente se for seguro.

     Se `products-table.tsx` inteiro estiver como `"use client"`, avaliar separar em:

     ```txt
     src/components/admin/products-table.tsx
     src/components/admin/product-quick-action-controls.tsx
     ```

     Direcao desejada:

     - `products-table.tsx` deve ser Server Component, se possivel;
     - `product-quick-action-controls.tsx` deve ser Client Component;
     - apenas botoes, selects e estados interativos ficam no client;
     - textos, badges, linhas e estrutura visual podem ficar no server.

     Se a separacao ficar arriscada demais, nao forcar. Nesse caso, manter a tabela client e otimizar apenas estados, loading e `router.refresh()`.

  5. Melhorar estado de carregamento por acao.

     Cada acao rapida deve evitar cliques duplicados enquanto estiver em andamento.

     Comportamento esperado:

     - botao ou controle fica desabilitado durante a acao;
     - usuario recebe feedback visual simples;
     - se a acao concluir, estado visual fica atualizado;
     - se a acao falhar, estado anterior volta;
     - toast de erro aparece quando aplicavel.

  6. Remover `router.refresh()` apenas quando for seguro.

     Regra de cuidado:

     - se a acao apenas muda um campo visivel do produto atual, como destaque, status ou visibilidade, preferir atualizacao local sem refresh;
     - se a acao remove o item da lista atual, como arquivar, restaurar ou excluir, avaliar se ainda precisa refresh ou se pode remover localmente;
     - se houver duvida, manter `router.refresh()` naquela acao especifica para nao quebrar consistencia.

     Nao remover todos os `router.refresh()` cegamente.

  7. Manter atualizacao otimista com rollback.

     Exemplo de direcao:

     ```tsx
     const previousState = currentState;

     setCurrentState(nextState);

     try {
       const result = await action(...);

       if (!result?.ok) {
         setCurrentState(previousState);
         showError(...);
       }
     } catch (error) {
       setCurrentState(previousState);
       showError(...);
     }
     ```

     Adaptar ao padrao real do projeto.

  8. Evitar refresh total em acoes pequenas.

     Para acoes como:

     ```txt
     destacar/remover destaque
     alterar visibilidade publica
     alterar status simples
     ```

     a UI deve responder localmente quando possivel.

     O objetivo e que o clique pareca instantaneo, sem travar a pagina inteira.

  9. Preservar comportamento de paginacao da T43.

     Confirmar que, depois das alteracoes:

     ```txt
     /admin/produtos?page=1
     /admin/produtos?page=2
     /admin/produtos?q=abc&page=1
     ```

     continuam funcionando.

  10. Preservar toasts existentes.

      Se o projeto ja usa `useToast`, manter o mesmo padrao.

      Nao criar outro sistema de toast.

      Nao mover `ToastProvider` nesta task, pois isso sera tratado em task propria.

  11. Garantir que a UI nao fique inconsistente apos erro.

      Testar ou revisar:

      - erro de action;
      - action retornando falha;
      - clique duplo rapido;
      - troca de status e falha;
      - arquivar/restaurar e falha.

      A interface nao deve mostrar sucesso se a action falhou.

  12. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  13. Atualizar o checklist da T44 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - As acoes rapidas do admin continuam funcionando.
  - Cliques em status, destaque, visibilidade ou acoes semelhantes respondem mais rapido visualmente.
  - Botoes ou controles ficam protegidos contra clique duplicado durante carregamento.
  - `router.refresh()` foi removido apenas das acoes em que isso era seguro.
  - Acoes que precisam de consistencia total continuam podendo usar refresh.
  - Erros fazem rollback do estado visual quando aplicavel.
  - Toasts de sucesso e erro continuam funcionando.
  - A tabela admin continua exibindo produtos corretamente.
  - A paginacao da T43 continua funcionando.
  - Busca e filtros existentes continuam funcionando.
  - Nenhuma regra de negocio foi alterada.
  - Nenhuma migration foi criada.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build


- [ ] T45. Aplicar cache publico seguro e reduzir JavaScript desnecessario

  **Objetivo:**  
  Deixar as paginas publicas do AgroMassa mais leves e rapidas, removendo renderizacao dinamica desnecessaria e evitando que JavaScript administrativo seja carregado no site publico.

  **Motivo:**  
  Algumas paginas publicas podem estar usando `force-dynamic`, fazendo o Next.js renderizar tudo novamente a cada requisicao. Isso aumenta tempo de resposta em paginas como home, catalogo e detalhe de produto.  
  Alem disso, se providers usados somente no admin estiverem no layout global, o site publico pode carregar JavaScript desnecessario, piorando a performance percebida.

  **Escopo permitido:**  
  - Revisar paginas publicas que usam `dynamic = "force-dynamic"`.
  - Substituir renderizacao dinamica por cache/revalidacao segura quando possivel.
  - Usar `revalidate` em paginas publicas que podem aceitar cache curto.
  - Manter paginas administrativas sempre dinamicas.
  - Mover `ToastProvider` do layout global para o layout admin, se ele for usado apenas no admin.
  - Preservar funcionamento dos toasts administrativos.
  - Preservar funcionamento da home, catalogo e detalhe de produto.
  - Documentar qualquer pagina que precise continuar dinamica.

  **Escopo proibido:**  
  - Nao alterar regras de produto.
  - Nao alterar regras de publicacao, destaque, visibilidade ou arquivamento.
  - Nao alterar listagem admin.
  - Nao alterar paginacao do catalogo.
  - Nao alterar upload de imagens.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao mexer em server actions de produto.
  - Nao aplicar cache em paginas admin.
  - Nao aplicar cache em rotas que dependem de sessao, autenticacao ou dados sensiveis.
  - Nao remover providers sem confirmar onde sao usados.

  **Arquivos provaveis:**  
  - `app/layout.tsx`
  - `app/admin/(protected)/layout.tsx`
  - `app/(public)/page.tsx`
  - `app/(public)/produtos/page.tsx`
  - `app/(public)/produtos/[slug]/page.tsx`
  - `src/components/providers/toast-provider.tsx`, somente para verificar uso
  - `src/components/ui/toast.tsx`, somente para verificar uso
  - `src/features/institutional/get-site-settings.ts`, se necessario revisar cache de dados institucionais
  - `src/features/products/public-list-products.ts`, somente se necessario revisar compatibilidade com cache
  - `src/features/products/public-get-product.ts`, somente se existir e for necessario revisar detalhe publico

  **Passos de implementacao:**

  1. Revisar layouts e providers globais.

     Verificar:

     ```txt
     app/layout.tsx
     app/admin/(protected)/layout.tsx
     ```

     Identificar se o `ToastProvider` ou outro provider client esta envolvendo o app inteiro sem necessidade.

  2. Confirmar onde `useToast` ou componentes de toast sao usados.

     Procurar no projeto por:

     ```txt
     useToast
     ToastProvider
     toast
     ```

     Se os toasts forem usados somente no admin, mover o `ToastProvider` para o layout admin.

     Se houver uso real no site publico, nao remover do layout global sem criar alternativa segura.

  3. Mover `ToastProvider` com seguranca, se aplicavel.

     Se o provider estiver em:

     ```tsx
     app/layout.tsx
     ```

     E for usado apenas no admin, remover do layout global e adicionar em:

     ```txt
     app/admin/(protected)/layout.tsx
     ```

     Direcao esperada:

     ```tsx
     <ToastProvider>
       <AdminHeader ... />
       {children}
     </ToastProvider>
     ```

     Preservar a estrutura real do layout admin.  
     Nao alterar autenticacao, sessao, protecao de rota ou header admin.

  4. Revisar paginas publicas com renderizacao dinamica forcada.

     Verificar arquivos como:

     ```txt
     app/(public)/page.tsx
     app/(public)/produtos/page.tsx
     app/(public)/produtos/[slug]/page.tsx
     ```

     Procurar por:

     ```ts
     export const dynamic = "force-dynamic";
     ```

  5. Remover `force-dynamic` apenas onde for seguro.

     Regra de seguranca:

     - paginas publicas sem dados de sessao podem usar cache;
     - paginas publicas com dados institucionais podem usar `revalidate`;
     - paginas publicas de catalogo podem usar revalidacao curta;
     - paginas admin nao devem receber cache;
     - paginas que dependem de autenticacao nao devem ser alteradas.

     Se houver duvida em uma pagina especifica, manter dinamica e documentar o motivo.

  6. Aplicar `revalidate` em paginas publicas adequadas.

     Direcao esperada:

     ```ts
     export const revalidate = 60;
     ```

     Usar valor curto e seguro inicialmente, como 60 segundos.

     O objetivo e melhorar performance sem deixar o conteudo publico desatualizado por muito tempo.

  7. Garantir compatibilidade com filtros do catalogo.

     Se `/produtos` usa `searchParams`, garantir que cache/revalidacao nao quebre:

     ```txt
     /produtos
     /produtos?q=...
     /produtos?page=...
     ```

     O uso de `revalidate` nao deve fazer filtros mostrarem resultados errados.

  8. Garantir que detalhe de produto continue correto.

     Em:

     ```txt
     /produtos/[slug]
     ```

     confirmar que:

     - produto publicado continua abrindo;
     - produto inexistente continua retornando 404 ou comportamento atual;
     - produto nao publico nao aparece indevidamente;
     - metadata, se existir, continua funcionando.

  9. Nao aplicar cache no admin.

     Confirmar que arquivos em:

     ```txt
     app/admin
     ```

     continuam dinamicos, principalmente rotas protegidas.

     Nao adicionar `revalidate` em paginas admin nesta task.

  10. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  11. Atualizar o checklist da T45 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - O `ToastProvider` nao fica mais no layout global se for usado apenas no admin.
  - Os toasts do admin continuam funcionando.
  - Paginas publicas seguras deixam de usar `force-dynamic`.
  - Paginas publicas adequadas usam `revalidate` ou estrategia equivalente de cache seguro.
  - Paginas admin continuam sem cache publico.
  - Home publica continua carregando corretamente.
  - Catalogo publico continua carregando corretamente.
  - Filtros e busca do catalogo continuam funcionando.
  - Detalhe de produto continua funcionando.
  - Produto nao publico continua protegido contra exibicao indevida.
  - Nenhuma regra de negocio foi alterada.
  - Nenhuma migration foi criada.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build


  - [ ] T46. Otimizar banco, metricas do dashboard e versoes do projeto

  **Objetivo:**  
  Melhorar a performance das consultas principais do AgroMassa, otimizar as metricas do dashboard administrativo e estabilizar as versoes das dependencias do projeto para evitar que futuras instalacoes quebrem comportamento, build ou performance.

  **Motivo:**  
  Mesmo com melhorias no frontend, o sistema ainda pode ficar lento se o banco nao tiver indices adequados para listagens publicas, listagens admin e imagens de produtos.  
  Alem disso, o dashboard pode estar fazendo varias contagens separadas no banco, o que aumenta o custo de abertura da area administrativa.  
  Por fim, dependencias usando `"latest"` podem trazer mudancas inesperadas em futuras instalacoes, causando bugs ou perda de performance.

  **Escopo permitido:**  
  - Criar migration com indices de performance.
  - Adicionar indices seguros para consultas de produtos e imagens.
  - Otimizar metricas do dashboard administrativo.
  - Reduzir multiplas contagens do dashboard quando for seguro.
  - Fixar versoes no `package.json` com base no `package-lock.json`.
  - Rodar validacoes do Prisma, TypeScript, lint e build.
  - Documentar riscos e comandos executados.

  **Escopo proibido:**  
  - Nao alterar regras de negocio.
  - Nao alterar cadastro, edicao, publicacao ou arquivamento de produtos.
  - Nao alterar upload de imagens.
  - Nao alterar componentes visuais.
  - Nao alterar layout publico ou admin.
  - Nao alterar paginacao publica.
  - Nao alterar paginacao admin.
  - Nao mexer em cache publico.
  - Nao remover campos do banco.
  - Nao renomear colunas existentes.
  - Nao apagar migrations antigas.
  - Nao atualizar dependencias para novas versoes sem necessidade.
  - Nao trocar biblioteca principal do projeto.

  **Arquivos provaveis:**  
  - `prisma/schema.prisma`
  - `prisma/migrations/*`
  - `src/features/products/get-admin-dashboard-metrics.ts`
  - `package.json`
  - `package-lock.json`
  - `specs/performance-baseline.md`, somente se necessario registrar observacoes finais

  **Passos de implementacao:**

  1. Revisar o schema Prisma antes de criar qualquer migration.

     Verificar:

     ```txt
     prisma/schema.prisma
     ```

     Identificar os nomes reais dos models e campos relacionados a:

     ```txt
     Product
     ProductImage
     status
     isFeatured
     isPublicVisible
     isArchived
     mainImageId
     createdAt
     updatedAt
     productId
     sortOrder
     ```

     Usar os nomes reais do projeto.  
     Nao inventar campo novo nesta task.

  2. Revisar as consultas otimizadas nas tasks anteriores.

     Conferir quais campos sao usados em:

     ```txt
     src/features/products/public-list-products.ts
     src/features/products/admin-list-products.ts
     src/features/products/get-admin-dashboard-metrics.ts
     ```

     Os indices devem apoiar as consultas reais do sistema, especialmente:

     - listagem publica de produtos;
     - ordenacao por destaque e data;
     - listagem admin por data de atualizacao;
     - imagens ordenadas por produto;
     - produtos visiveis publicamente.

  3. Criar migration de indices de performance.

     Criar uma nova migration Prisma com nome claro, por exemplo:

     ```txt
     add_product_performance_indexes
     ```

     A migration deve ser pequena e objetiva.

     Exemplo de indices sugeridos, adaptando nomes de tabelas e colunas ao banco real:

     ```sql
     CREATE INDEX IF NOT EXISTS "product_images_product_order_idx"
     ON "product_images"("product_id", "sort_order", "created_at", "id");

     CREATE INDEX IF NOT EXISTS "products_admin_order_idx"
     ON "products"("updated_at" DESC, "created_at" DESC, "id" DESC);

     CREATE INDEX IF NOT EXISTS "products_public_active_order_idx"
     ON "products"("is_featured" DESC, "created_at" DESC, "id" DESC)
     WHERE "is_public_visible" = true
       AND "is_archived" = false
       AND "status" <> 'rascunho'
       AND "main_image_id" IS NOT NULL;
     ```

     **Importante:**  
     Antes de aplicar, confirmar se os nomes das tabelas e colunas no banco usam `snake_case` exatamente como no exemplo.  
     Se o Prisma mapear nomes diferentes com `@@map` ou `@map`, usar os nomes reais do banco.

  4. Evitar indices duplicados.

     Antes de criar novos indices, verificar se ja existem indices equivalentes no `schema.prisma` ou migrations antigas.

     Se ja existir um indice igual ou muito parecido, nao duplicar.

     Nesse caso, documentar que o indice ja existia e seguir para o proximo.

  5. Otimizar metricas do dashboard administrativo.

     Revisar:

     ```txt
     src/features/products/get-admin-dashboard-metrics.ts
     ```

     Se o arquivo fizer muitas chamadas separadas como:

     ```ts
     prisma.product.count()
     ```

     avaliar trocar por uma consulta unica com SQL agregado.

     Direcao esperada:

     ```ts
     const [metrics] = await prisma.$queryRaw<AdminDashboardMetrics[]>`
       SELECT
         COUNT(*)::int AS "totalProducts",
         COUNT(*) FILTER (WHERE status <> 'rascunho')::int AS "publishedProducts",
         COUNT(*) FILTER (WHERE status = 'disponivel')::int AS "availableProducts",
         COUNT(*) FILTER (
           WHERE is_archived = false
             AND is_public_visible = true
             AND main_image_id IS NOT NULL
             AND status <> 'rascunho'
         )::int AS "publiclyVisibleProducts",
         COUNT(*) FILTER (WHERE status = 'rascunho')::int AS "draftProducts",
         COUNT(*) FILTER (WHERE is_archived = true)::int AS "archivedProducts",
         COUNT(*) FILTER (WHERE is_featured = true)::int AS "featuredProducts",
         COUNT(*) FILTER (WHERE main_image_id IS NULL)::int AS "productsMissingMainImage"
       FROM products
     `;
     ```

     Adaptar nomes de tabela, colunas e status aos nomes reais do projeto.

     Se houver risco de incompatibilidade com o banco ou com tipos existentes, manter as contagens atuais e documentar o motivo.

  6. Preservar o formato retornado pelas metricas.

     A tela admin que consome as metricas nao deve precisar ser reescrita.

     O retorno da funcao deve continuar com os mesmos nomes de propriedades que ja existem.

     Se os nomes atuais forem diferentes do exemplo acima, manter os nomes atuais.

  7. Fixar versoes no `package.json`.

     Revisar:

     ```txt
     package.json
     package-lock.json
     ```

     Procurar dependencias usando:

     ```json
     "latest"
     ```

     Trocar por versoes fixas presentes no `package-lock.json`.

     Exemplo:

     ```json
     "next": "16.2.4",
     "react": "19.2.5",
     "react-dom": "19.2.5"
     ```

     Usar as versoes reais encontradas no `package-lock.json` do projeto.

  8. Nao atualizar dependencias nesta task.

     Esta task deve apenas fixar as versoes atuais.

     Nao rodar comandos como:

     ```bash
     npm update
     npm install next@latest
     npm install react@latest
     ```

     O objetivo e estabilidade, nao upgrade.

  9. Atualizar o `package-lock.json` de forma segura.

     Depois de alterar o `package.json`, rodar:

     ```bash
     npm install --package-lock-only
     ```

     ou o comando equivalente seguro para sincronizar o lockfile sem atualizar pacotes indevidamente.

     Se o lockfile nao mudar, documentar isso no resultado.

  10. Aplicar e validar migration em ambiente local.

      Rodar:

      ```bash
      npm run prisma:validate
      ```

      Depois, se o projeto tiver script seguro de migration local, rodar o script existente.

      Exemplos possiveis:

      ```bash
      npm run prisma:migrate
      ```

      ou:

      ```bash
      npx prisma migrate dev
      ```

      Usar preferencialmente o script ja definido no `package.json`.

      Se o ambiente nao tiver banco configurado, nao forcar migration.  
      Nesse caso, registrar que a migration foi criada, mas nao aplicada localmente por falta de ambiente.

  11. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  12. Atualizar o checklist da T46 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  13. Registrar observacoes finais no baseline, se fizer sentido.

      Se a task melhorar pontos importantes ou se algum comando nao puder ser executado, atualizar:

      ```txt
      specs/performance-baseline.md
      ```

      Com uma secao simples:

      ```md
      ## Observacoes apos T46

      - Indices adicionados:
      - Metricas otimizadas:
      - Dependencias fixadas:
      - Comandos executados:
      - Pendencias:
      ```

  **Criterios de aceite:**

  - Foram criados indices de performance apenas quando nao havia indice equivalente.
  - A migration usa nomes reais de tabelas e colunas do banco.
  - Nenhuma coluna foi removida ou renomeada.
  - Nenhuma regra de negocio foi alterada.
  - As metricas do dashboard continuam retornando os mesmos campos esperados pela interface.
  - Se as metricas foram otimizadas, a nova consulta retorna os mesmos valores logicos da implementacao anterior.
  - Dependencias que estavam como `"latest"` foram fixadas com base no `package-lock.json`.
  - Nenhuma dependencia foi atualizada sem necessidade.
  - `package.json` e `package-lock.json` ficaram consistentes.
  - O Prisma valida corretamente.
  - O build final passa, se o ambiente estiver completo.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build


- [ ] T47. Comprimir e redimensionar imagens no upload

  **Objetivo:**  
  Reduzir o peso das imagens enviadas para o AgroMassa, comprimindo e redimensionando arquivos no momento do upload, sem quebrar imagens existentes, visualizacao publica, listagem admin ou fluxo de cadastro de produtos.

  **Motivo:**  
  Mesmo com `next/image`, se as imagens originais enviadas forem muito grandes, o sistema ainda pode sofrer com uploads pesados, armazenamento maior e carregamento mais lento.  
  Otimizar a imagem antes de salvar no Supabase reduz tamanho dos arquivos, melhora carregamento do catalogo e evita que imagens muito grandes deixem o sistema lento.

  **Escopo permitido:**  
  - Revisar o fluxo atual de upload de imagens.
  - Redimensionar imagens grandes antes do envio ao Supabase.
  - Comprimir imagens para um formato mais leve, preferencialmente WebP, se for seguro.
  - Manter compatibilidade com imagens existentes.
  - Preservar fallback de imagem padrao.
  - Preservar validacoes atuais de tipo e tamanho.
  - Atualizar metadata de imagem, se o projeto ja salva largura, altura, tamanho ou tipo.
  - Adicionar dependencia de processamento de imagem somente se necessario e seguro.

  **Escopo proibido:**  
  - Nao alterar regras de produto.
  - Nao alterar regras de publicacao, destaque, visibilidade ou arquivamento.
  - Nao alterar listagem publica.
  - Nao alterar listagem admin.
  - Nao alterar paginacao.
  - Nao alterar cache.
  - Nao alterar schema Prisma, a menos que ja exista campo inutilizado e seja estritamente necessario. Preferir nao mexer no schema nesta task.
  - Nao criar migration, salvo se for absolutamente indispensavel e justificado.
  - Nao apagar imagens antigas do Supabase.
  - Nao converter imagens antigas em massa nesta task.
  - Nao remover suporte a formatos existentes sem confirmar impacto.
  - Nao trocar provider de storage.

  **Arquivos provaveis:**  
  - `src/lib/storage/supabase-storage.ts`
  - `src/features/products/actions.ts`, somente se o upload passar por aqui
  - `src/features/products/image-actions.ts`, se existir
  - `src/components/admin/product-image-uploader.tsx`, somente para verificar contrato
  - `package.json`, se for necessario adicionar dependencia
  - `package-lock.json`, se for necessario adicionar dependencia

  **Passos de implementacao:**

  1. Revisar o fluxo atual de upload de imagens.

     Verificar onde o arquivo e recebido, validado e enviado ao Supabase.

     Procurar por funcoes como:

     ```txt
     uploadProductImage
     uploadImage
     uploadProductImageToStorage
     validateImage
     getProductImageDisplayUrl
     ```

     Verificar principalmente:

     ```txt
     src/lib/storage/supabase-storage.ts
     src/features/products/actions.ts
     ```

  2. Identificar as validacoes atuais.

     Antes de alterar o upload, confirmar:

     - tamanho maximo aceito;
     - tipos aceitos;
     - extensoes aceitas;
     - onde o erro e exibido para o usuario;
     - se o sistema salva `mimeType`, `size`, `width` ou `height`;
     - se o Supabase recebe `contentType`.

     Nao remover nenhuma validacao existente sem necessidade.

  3. Escolher estrategia segura de otimizacao.

     Preferir esta estrategia inicial:

     ```txt
     - redimensionar imagens maiores que 1600px de largura
     - manter proporcao original
     - converter para WebP com qualidade entre 75 e 85
     - nao aumentar imagens pequenas
     ```

     Exemplo de parametros seguros:

     ```txt
     largura maxima: 1600px
     qualidade WebP: 80
     formato final: image/webp
     ```

     Se houver risco de incompatibilidade com WebP no fluxo atual, manter o formato original e apenas redimensionar/comprimir.

  4. Avaliar dependencia de processamento de imagem.

     Se o projeto roda em ambiente Node.js compatível, usar `sharp`.

     Adicionar apenas se necessario:

     ```bash
     npm install sharp
     ```

     Se o ambiente de deploy nao suportar `sharp`, nao implementar conversao com `sharp`. Documentar o risco e manter a task sem mudanca arriscada.

  5. Criar funcao isolada para otimizar imagem.

     Criar uma funcao pequena e testavel, por exemplo:

     ```ts
     async function optimizeProductImage(file: File): Promise<{
       buffer: Buffer;
       contentType: string;
       extension: string;
       size: number;
       width?: number;
       height?: number;
     }>
     ```

     Ou adaptar ao formato real usado no projeto.

     A funcao deve:

     - receber o arquivo original;
     - validar se e imagem;
     - converter para buffer;
     - otimizar;
     - retornar buffer final, content type e extensao correta;
     - em caso de erro de otimizacao, retornar erro claro sem quebrar silenciosamente.

  6. Atualizar o upload para enviar o arquivo otimizado.

     No envio ao Supabase:

     - usar o buffer otimizado;
     - usar `contentType` correto;
     - ajustar nome/extensao do arquivo se converter para WebP;
     - manter path/storage key compativel com o padrao atual;
     - manter retorno esperado pela interface.

     Se antes o arquivo era `.jpg` e passar a ser `.webp`, garantir que:

     ```txt
     storageKey
     publicUrl
     mimeType
     ```

     fiquem coerentes.

  7. Preservar imagens existentes.

     Esta task nao deve alterar imagens ja cadastradas.

     Imagens antigas devem continuar abrindo normalmente.

     O sistema deve aceitar que alguns produtos tenham imagem antiga em JPG/PNG e novos produtos tenham imagem WebP.

  8. Preservar comportamento da interface.

     O usuario admin deve continuar conseguindo:

     - selecionar imagem;
     - enviar imagem;
     - ver preview;
     - definir imagem principal;
     - remover imagem, se essa funcionalidade existir;
     - ver erro amigavel se o arquivo for invalido.

  9. Garantir fallback em caso de erro.

     Se a otimizacao falhar por formato invalido ou erro de processamento:

     - nao salvar imagem quebrada;
     - retornar mensagem clara;
     - nao deixar produto em estado inconsistente.

     Nao fazer fallback silencioso para upload original se isso puder permitir arquivos muito pesados.  
     Se optar por fallback, documentar claramente o motivo.

  10. Atualizar dependencias com cuidado.

      Se adicionar `sharp`, garantir que `package.json` e `package-lock.json` sejam atualizados.

      Nao atualizar outras dependencias nesta task.

      Nao trocar versoes de Next, React, Prisma ou bibliotecas principais.

  11. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  12. Testar upload manualmente.

      Testar pelo menos:

      ```txt
      imagem JPG grande
      imagem PNG grande
      imagem pequena
      arquivo invalido
      ```

      Confirmar que imagens grandes ficam menores depois do upload.

  13. Atualizar o checklist da T47 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - Upload de imagem continua funcionando.
  - Imagens grandes sao redimensionadas antes de salvar.
  - Imagens novas ficam mais leves que o arquivo original quando aplicavel.
  - Imagens pequenas nao sao aumentadas sem necessidade.
  - Content type salvo/enviado ao Supabase fica correto.
  - URLs das imagens novas continuam funcionando.
  - Imagens antigas continuam funcionando.
  - Preview e visualizacao no admin continuam funcionando.
  - Catalogo publico continua exibindo imagens corretamente.
  - Produto sem imagem continua usando fallback.
  - Arquivos invalidos continuam sendo rejeitados.
  - Nenhuma regra de produto foi alterada.
  - Nenhuma migration foi criada, salvo se extremamente justificada.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build


  - [ ] T48. Melhorar estados de carregamento e navegacao

  **Objetivo:**  
  Melhorar a percepcao de velocidade do AgroMassa durante navegacoes, carregamentos de paginas e acoes demoradas, exibindo feedback visual claro para o usuario sem alterar regras de negocio ou fluxo de dados.

  **Motivo:**  
  Mesmo apos otimizar consultas, imagens e cache, o usuario ainda pode sentir delay se a interface nao mostrar que algo esta carregando.  
  Estados de loading, skeletons e feedback de navegacao deixam o sistema mais responsivo visualmente e evitam a sensacao de que o clique nao funcionou.

  **Escopo permitido:**  
  - Criar `loading.tsx` em rotas publicas e admin quando fizer sentido.
  - Criar skeletons simples para catalogo, tabela admin e dashboard.
  - Melhorar feedback visual em botoes de navegacao ou formularios, se ainda houver delay perceptivel.
  - Manter layout visual coerente com o AgroMassa.
  - Evitar mudancas grandes de design.
  - Reutilizar classes e componentes existentes sempre que possivel.

  **Escopo proibido:**  
  - Nao alterar regras de negocio.
  - Nao alterar consultas Prisma.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao alterar upload de imagens.
  - Nao alterar cache.
  - Nao alterar paginacao publica ou admin.
  - Nao mexer em server actions de produto, exceto se for apenas para preservar tipos/imports.
  - Nao instalar biblioteca nova de UI.
  - Nao refazer o layout do sistema.
  - Nao criar animacoes pesadas que prejudiquem performance.

  **Arquivos provaveis:**  
  - `app/(public)/loading.tsx`
  - `app/(public)/produtos/loading.tsx`
  - `app/admin/(protected)/loading.tsx`
  - `app/admin/(protected)/produtos/loading.tsx`
  - `src/components/public/product-card-skeleton.tsx`, se necessario
  - `src/components/admin/products-table-skeleton.tsx`, se necessario
  - `src/components/admin/dashboard-skeleton.tsx`, se necessario
  - Componentes de botoes ou formularios especificos, somente se necessario

  **Passos de implementacao:**

  1. Revisar rotas que podem apresentar delay visual.

     Verificar principalmente:

     ```txt
     app/(public)/page.tsx
     app/(public)/produtos/page.tsx
     app/admin/(protected)/page.tsx
     app/admin/(protected)/produtos/page.tsx
     ```

     Identificar quais telas carregam dados do banco, imagens ou listas maiores.

  2. Criar estados de loading por rota usando o padrao do Next.js.

     Criar arquivos `loading.tsx` apenas onde houver ganho real, por exemplo:

     ```txt
     app/(public)/produtos/loading.tsx
     app/admin/(protected)/produtos/loading.tsx
     ```

     Se a home publica ou dashboard admin tambem tiverem demora, criar:

     ```txt
     app/(public)/loading.tsx
     app/admin/(protected)/loading.tsx
     ```

     Nao criar loading desnecessario em rotas muito simples.

  3. Criar skeleton para cards de produto.

     Se ainda nao existir, criar um componente simples:

     ```txt
     src/components/public/product-card-skeleton.tsx
     ```

     O skeleton deve:

     - lembrar o formato real do card;
     - nao depender de dados;
     - nao usar JavaScript client se nao for necessario;
     - usar apenas CSS/classes existentes;
     - ser leve.

  4. Criar skeleton para tabela admin, se necessario.

     Se `/admin/produtos` ainda tiver delay perceptivel, criar:

     ```txt
     src/components/admin/products-table-skeleton.tsx
     ```

     O skeleton deve representar:

     - barra ou cabecalho da tabela;
     - algumas linhas falsas;
     - botoes/acoes simulados visualmente;
     - sem interatividade real.

  5. Criar skeleton para dashboard admin, se necessario.

     Se `/admin` carrega metricas e cards, criar:

     ```txt
     src/components/admin/dashboard-skeleton.tsx
     ```

     O skeleton deve representar os cards principais sem buscar dados.

  6. Manter componentes de loading como Server Components.

     Nao adicionar `"use client"` em skeletons, a menos que seja indispensavel.

     Loading visual simples nao deve adicionar JavaScript desnecessario.

  7. Evitar spinners grandes e bloqueantes.

     Preferir skeletons leves a telas inteiras com spinner.

     O usuario deve sentir que a pagina esta carregando estrutura, nao que o sistema travou.

  8. Melhorar feedback de botoes apenas onde ainda houver delay claro.

     Se houver botoes de formulario ou navegacao sem feedback, ajustar com cuidado.

     Regras:

     - nao duplicar logica ja criada na T44;
     - nao mexer em server actions sem necessidade;
     - nao alterar regra de submit;
     - apenas exibir estado pendente quando ja houver suporte seguro.

  9. Preservar acessibilidade basica.

     Quando houver loading, usar textos claros quando necessario:

     ```txt
     Carregando produtos...
     Carregando painel...
     ```

     Evitar que skeletons sejam lidos como conteudo real por leitores de tela, quando aplicavel.

  10. Garantir que o loading nao cause mudanca brusca de layout.

      O skeleton deve ter altura e estrutura parecida com a tela final.

      Isso reduz saltos visuais enquanto os dados carregam.

  11. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  12. Atualizar o checklist da T48 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - Rotas com carregamento perceptivel exibem feedback visual adequado.
  - `/produtos` mostra skeleton ou loading leve enquanto carrega.
  - `/admin/produtos` mostra skeleton ou loading leve enquanto carrega, se aplicavel.
  - `/admin` mostra skeleton ou loading leve enquanto carrega, se aplicavel.
  - Loading states nao adicionam JavaScript client desnecessario.
  - Skeletons respeitam o layout visual existente.
  - Nao ha alteracao de regra de negocio.
  - Nao ha alteracao de schema Prisma.
  - Nenhuma migration foi criada.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build

  - [ ] T49. Reduzir JavaScript client desnecessario

  **Objetivo:**  
  Reduzir a quantidade de JavaScript enviada ao navegador, removendo `"use client"` de componentes que nao precisam de interatividade e separando componentes estaticos de componentes interativos quando for seguro.

  **Motivo:**  
  Em projetos Next.js, componentes marcados com `"use client"` aumentam o JavaScript enviado ao navegador e precisam ser hidratados no cliente.  
  Se componentes grandes, tabelas, cards, layouts ou secoes estaticas estiverem como client components sem necessidade, o sistema pode ficar mais pesado e com delay perceptivel em navegacoes e cliques.

  **Escopo permitido:**  
  - Mapear componentes que usam `"use client"`.
  - Identificar componentes que nao usam estado, eventos, hooks ou APIs do navegador.
  - Remover `"use client"` apenas onde for claramente seguro.
  - Separar partes interativas em componentes client pequenos, se necessario.
  - Manter componentes visuais estaticos como Server Components.
  - Preservar comportamento, layout e estilos existentes.
  - Documentar componentes que precisam continuar client.

  **Escopo proibido:**  
  - Nao alterar regras de negocio.
  - Nao alterar consultas Prisma.
  - Nao alterar server actions.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao alterar upload de imagens.
  - Nao alterar paginacao publica ou admin.
  - Nao mexer em cache.
  - Nao instalar biblioteca nova.
  - Nao refatorar grandes areas do sistema sem necessidade.
  - Nao remover `"use client"` de componentes que usam hooks client.
  - Nao remover `"use client"` de componentes que usam eventos como `onClick`, `onChange`, `onSubmit`.
  - Nao remover `"use client"` de componentes que usam `useState`, `useEffect`, `useTransition`, `useRouter`, `usePathname`, `useSearchParams`, `window`, `document` ou `localStorage`.

  **Arquivos provaveis:**  
  - `src/components/**/*.tsx`
  - `app/**/*.tsx`
  - `src/components/admin/products-table.tsx`
  - `src/components/public/**/*.tsx`
  - `src/components/layout/**/*.tsx`, se existir
  - `src/components/providers/**/*.tsx`, somente para verificar uso

  **Passos de implementacao:**

  1. Mapear todos os arquivos que usam `"use client"`.

     Rodar ou procurar manualmente:

     ```bash
     grep -R "\"use client\"" -n app src
     ```

     Se estiver no Windows, usar busca do editor ou comando equivalente.

  2. Para cada arquivo encontrado, classificar como:

     ```txt
     precisa continuar client
     pode virar server component
     pode ser dividido em server + client pequeno
     duvidoso, manter como esta
     ```

     Nao alterar arquivos duvidosos.

  3. Confirmar se o componente usa recursos client.

     Um componente deve continuar client se usar qualquer item como:

     ```txt
     useState
     useEffect
     useTransition
     useRouter
     usePathname
     useSearchParams
     onClick
     onChange
     onSubmit
     window
     document
     localStorage
     sessionStorage
     File
     FileReader
     input de upload
     drag and drop
     toast
     ```

  4. Remover `"use client"` somente de componentes claramente estaticos.

     Exemplos de componentes que podem ser server:

     ```txt
     card puramente visual
     cabecalho sem menu interativo
     bloco de texto
     badge
     skeleton
     secao institucional
     card de produto sem evento client
     tabela sem acoes client internas
     ```

     Remover apenas quando nao houver hooks, eventos ou APIs do navegador.

  5. Separar componente grande quando for seguro.

     Se um componente grande tiver uma pequena parte interativa, preferir separar:

     ```txt
     componente-grande.tsx        -> server component
     componente-controles.tsx     -> client component
     ```

     Exemplo de direcao:

     ```txt
     ProductCard       -> server, se apenas exibe dados
     FavoriteButton    -> client, se tiver clique
     ProductsTable     -> server, se estrutura for estatica
     ProductActions    -> client, se tiver botoes e estado
     ```

     Se a separacao exigir muitas mudancas ou gerar risco, nao fazer nesta task.

  6. Preservar imports e tipos.

     Ao remover `"use client"`, verificar se algum import passa a ser invalido em Server Component.

     Se o componente importar algo client, manter como client ou separar com cuidado.

  7. Nao alterar visual.

     A task deve manter:

     - classes CSS;
     - estrutura visual;
     - textos;
     - responsividade;
     - comportamento de hover;
     - links existentes;
     - acessibilidade existente.

  8. Nao alterar fluxo de dados.

     Nao mover chamadas Prisma, server actions ou regras de carregamento nesta task.

     O objetivo e apenas reduzir client JavaScript quando for seguro.

  9. Documentar componentes que permaneceram client.

     Se algum componente parece pesado mas precisa continuar client, registrar no resultado final o motivo.

     Exemplo:

     ```txt
     product-image-uploader.tsx continua client porque usa input file e estado de upload.
     products-table-actions.tsx continua client porque usa server actions, loading e toast.
     ```

  10. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  11. Atualizar o checklist da T49 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - Componentes client foram revisados com cuidado.
  - `"use client"` foi removido apenas de componentes claramente seguros.
  - Partes interativas continuam funcionando.
  - Componentes com hooks, eventos ou APIs do navegador continuam como client.
  - Nenhuma regra de negocio foi alterada.
  - Nenhuma consulta Prisma foi alterada.
  - Nenhuma migration foi criada.
  - O layout visual permanece equivalente.
  - O admin continua funcionando.
  - O site publico continua funcionando.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build

  - [ ] T50. Auditar bundle, imports e dependencias pesadas

  **Objetivo:**  
  Identificar e reduzir peso desnecessario no bundle JavaScript do AgroMassa, revisando imports, dependencias, componentes carregados no cliente e bibliotecas usadas em paginas publicas e administrativas.

  **Motivo:**  
  Mesmo com consultas, imagens e cache otimizados, o sistema ainda pode ficar lento se o navegador precisar baixar, interpretar e hidratar JavaScript demais.  
  Imports grandes, bibliotecas usadas de forma global, componentes client desnecessarios ou dependencias pouco usadas podem aumentar o tempo de carregamento e causar delay ao clicar.

  **Escopo permitido:**  
  - Auditar tamanho do bundle do projeto.
  - Identificar dependencias pesadas ou pouco usadas.
  - Revisar imports desnecessarios em componentes publicos e admin.
  - Trocar imports amplos por imports especificos quando for seguro.
  - Remover dependencias nao usadas somente se houver certeza.
  - Aplicar dynamic import em componentes pesados e nao essenciais, quando for seguro.
  - Documentar dependencias que devem permanecer.

  **Escopo proibido:**  
  - Nao alterar regra de negocio.
  - Nao alterar consultas Prisma.
  - Nao alterar schema Prisma.
  - Nao criar migration.
  - Nao alterar upload de imagens.
  - Nao alterar cache.
  - Nao alterar paginacao publica ou admin.
  - Nao refazer layout.
  - Nao trocar biblioteca principal do projeto sem necessidade.
  - Nao remover dependencia se houver duvida sobre uso.
  - Nao instalar biblioteca nova.
  - Nao aplicar otimizacao agressiva que mude comportamento visual.

  **Arquivos provaveis:**  
  - `package.json`
  - `package-lock.json`
  - `next.config.ts`
  - `app/**/*.tsx`
  - `src/components/**/*.tsx`
  - `src/lib/**/*.ts`
  - `src/features/**/*.ts`
  - `src/features/**/*.tsx`

  **Passos de implementacao:**

  1. Gerar build atual do projeto.

     Rodar:

     ```bash
     npm run build
     ```

     Registrar se o build aponta paginas, chunks ou bundles grandes.

  2. Verificar dependencias instaladas.

     Revisar:

     ```txt
     package.json
     ```

     Identificar bibliotecas que parecem pesadas ou pouco usadas.

     Exemplos de pontos a observar:

     ```txt
     bibliotecas de icones
     bibliotecas de data
     bibliotecas de grafico
     editores rich text
     bibliotecas de animacao
     bibliotecas de upload
     bibliotecas UI grandes
     ```

     Nao remover nada ainda sem confirmar uso real.

  3. Procurar imports amplos ou desnecessarios.

     Buscar padroes como:

     ```ts
     import * as Icons from ...
     import { variosItens } from ...
     ```

     Verificar se ha imports grandes usados em paginas publicas sem necessidade.

     Quando for seguro, trocar por import especifico.

     Exemplo de direcao:

     ```ts
     import { Search } from "lucide-react";
     ```

     Em vez de importar biblioteca inteira ou objeto com muitos icones.

  4. Verificar bibliotecas usadas no site publico.

     Revisar paginas e componentes em:

     ```txt
     app/(public)
     src/components/public
     ```

     Confirmar se o site publico esta importando algo administrativo, como:

     ```txt
     componentes admin
     providers admin
     actions admin
     bibliotecas usadas apenas em formulario admin
     upload
     toast
     editor
     ```

     Se houver import indevido, separar com cuidado.

  5. Verificar bibliotecas usadas no admin.

     Revisar:

     ```txt
     app/admin
     src/components/admin
     ```

     O admin pode carregar mais JavaScript que o publico, mas ainda deve evitar imports globais desnecessarios.

     Nao remover funcionalidades administrativas.

  6. Identificar componentes pesados que podem ser carregados sob demanda.

     Se houver componente pesado usado apenas depois de uma acao do usuario, avaliar `dynamic import`.

     Exemplos de componentes que podem ser candidatos:

     ```txt
     modal grande
     editor
     uploader avancado
     preview pesado
     grafico
     componente de configuracao raramente usado
     ```

     Usar dynamic import apenas se:

     - o componente nao for essencial para primeira renderizacao;
     - nao quebrar SEO publico;
     - nao causar erro de Server/Client Component;
     - melhorar carregamento inicial.

  7. Aplicar dynamic import somente em casos seguros.

     Exemplo de direcao:

     ```tsx
     import dynamic from "next/dynamic";

     const HeavyComponent = dynamic(() => import("./heavy-component"), {
       loading: () => <div>Carregando...</div>,
     });
     ```

     Nao aplicar dynamic import em componente essencial acima da dobra ou em conteudo critico de SEO.

  8. Remover dependencias nao usadas apenas com confirmacao forte.

     Antes de remover qualquer dependencia, confirmar que ela nao aparece em:

     ```txt
     app
     src
     prisma
     scripts
     ```

     Se houver duvida, nao remover.

     Se remover dependencia, rodar:

     ```bash
     npm uninstall nome-da-dependencia
     ```

     E validar `package.json` e `package-lock.json`.

  9. Nao mexer em dependencias criticas.

     Nao remover ou trocar sem necessidade:

     ```txt
     next
     react
     react-dom
     prisma
     @prisma/client
     typescript
     tailwind
     eslint
     supabase
     auth
     ```

  10. Registrar decisoes da auditoria.

      Se fizer sentido, adicionar no baseline ou criar secao em:

      ```txt
      specs/performance-baseline.md
      ```

      Exemplo:

      ```md
      ## Observacoes apos T50

      - Imports otimizados:
      - Dependencias removidas:
      - Dependencias mantidas por seguranca:
      - Componentes carregados sob demanda:
      - Riscos observados:
      ```

  11. Rodar validacoes obrigatorias:

      ```bash
      npm run prisma:validate
      npm run typecheck
      npm run lint
      npm run build
      ```

  12. Atualizar o checklist da T50 no `specs/04-tasks.md` somente depois que a task estiver concluida e validada.

  **Criterios de aceite:**

  - O bundle foi auditado com base no build.
  - Imports desnecessarios foram removidos ou ajustados quando seguro.
  - Imports amplos foram trocados por imports especificos quando seguro.
  - Componentes pesados foram carregados sob demanda apenas quando isso nao altera comportamento critico.
  - Dependencias nao usadas foram removidas somente com confirmacao forte.
  - Dependencias criticas do projeto nao foram trocadas sem necessidade.
  - Site publico continua funcionando.
  - Admin continua funcionando.
  - Nenhuma regra de negocio foi alterada.
  - Nenhuma migration foi criada.
  - O build final passa.

  **Validacoes obrigatorias:**

  ```bash
  npm run prisma:validate
  npm run typecheck
  npm run lint
  npm run build


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
T32 -> T33
T33 -> T34 -> T35 -> T36 -> T37 -> T38 -> T39
```

---

## Observacao final

As tarefas foram mantidas pequenas e sequenciais para permitir execucao uma por vez. Em um segundo momento, depois da sua aprovacao, podemos ajustar o `04-tasks.md` para marcar status de cada tarefa conforme a implementacao avancar.
