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

**Status**: Pendente

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

**Status**: Pendente

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

**Status**: Pendente

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

**Status**: Pendente

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
