# AgroMassa - Especificacao do Projeto

## Status do Fluxo

- Specify: concluida
- Fase atual: Clarify
- Proxima fase: Design
- Fonte inicial: `specs/01-ideia.md`
- Escopo deste documento: definir o que o produto deve fazer antes de qualquer design tecnico ou implementacao.

---

## Visao Geral do Produto

O AgroMassa sera um site institucional e comercial para divulgacao de tratores e implementos agricolas. O produto deve apresentar a empresa, listar maquinas disponiveis, permitir busca e filtros, exibir detalhes e fotos dos produtos e conduzir o visitante interessado para atendimento via WhatsApp.

O sistema nao sera um e-commerce. Nao havera carrinho, checkout, pagamento online ou fechamento automatico de pedido. A conversao principal sera o contato direto com a AgroMassa para negociacao de compra, venda, troca ou locacao.

O projeto tera duas areas principais:

- Area publica: site aberto para visitantes consultarem a empresa e os produtos.
- Area administrativa: ambiente restrito para gestao de produtos, fotos, destaques, status e informacoes institucionais.

### Contexto Confirmado na Clarify

- A logo oficial do projeto e `agromassa.jpeg`.
- O sistema deve nascer com um texto institucional inicial editavel para a AgroMassa.
- Os contatos publicos do MVP serao WhatsApp, telefone e cidade/estado.
- A cidade publica inicial da empresa sera Sao Francisco-SP.
- O site tera painel administrativo proprio.
- O conteudo sera persistido em banco de dados.

---

## Objetivos

### Objetivos do Produto

- Apresentar a AgroMassa de forma profissional, confiavel e alinhada ao agronegocio.
- Disponibilizar um catalogo publico de tratores e implementos agricolas.
- Facilitar a consulta de produtos por busca, categoria, condicao, marca e status.
- Permitir que clientes interessados acionem a AgroMassa via WhatsApp a partir de cada produto.
- Dar autonomia para administradores manterem produtos, fotos e informacoes da empresa atualizados.

### Objetivos do MVP

- Publicar uma pagina institucional com dados da AgroMassa.
- Publicar uma pagina de catalogo com produtos cadastrados.
- Exibir detalhes completos do produto, incluindo galeria de fotos.
- Permitir busca por nome, marca, modelo e descricao.
- Permitir filtros essenciais de catalogo.
- Ordenar catalogo com destaques primeiro e, em seguida, produtos mais recentes.
- Redirecionar interessados para o WhatsApp com contexto do produto.
- Oferecer login administrativo.
- Permitir cadastro, edicao, exclusao e controle de exibicao de produtos.
- Permitir edicao das informacoes institucionais basicas.

### Fora do Escopo Inicial

| Item | Motivo |
| --- | --- |
| Carrinho de compras | O contato e a negociacao acontecerao pelo WhatsApp. |
| Checkout | O site nao fechara compras online no MVP. |
| Pagamento online | Nao faz parte do fluxo comercial inicial. |
| Calculo de frete | Condicoes logisticas devem ser negociadas diretamente. |
| Marketplace multiusuario | A gestao inicial sera da AgroMassa, nao de vendedores externos. |
| Chat interno | WhatsApp sera o canal de atendimento. |
| Multiplos perfis administrativos complexos | O MVP precisa de administracao simples. |
| Integracao com ERP | Nao ha requisito inicial de sincronizacao externa. |
| Estoque avancado | O status simples do produto cobre o MVP. |

---

## Usuarios

### Visitante Publico

Produtor rural, fazendeiro, comprador de maquinas, empresa do agronegocio ou pessoa interessada em compra, venda, troca ou locacao de maquinas agricolas.

Necessidades principais:

- Conhecer a AgroMassa.
- Encontrar tratores e implementos relevantes.
- Avaliar fotos, especificacoes, ano, marca, modelo, condicao e status.
- Entrar em contato rapidamente pelo WhatsApp.

### Administrador

Pessoa autorizada pela AgroMassa a manter o conteudo do site.

Necessidades principais:

- Entrar em area restrita com login.
- Cadastrar, editar e remover produtos.
- Enviar e organizar fotos.
- Definir destaque, status e visibilidade publica.
- Atualizar informacoes institucionais e de contato.

---

## Paginas do Sistema

### Area Publica

| Pagina | Objetivo |
| --- | --- |
| Home / Institucional | Apresentar a AgroMassa, sua proposta, contatos, cidade/estado e servicos. |
| Catalogo de Produtos | Listar tratores e implementos com busca, filtros e cards/lista de produtos. |
| Detalhes do Produto | Exibir informacoes completas, galeria de fotos e botao de WhatsApp. |
| Secao Sobre a Empresa | Reforcar historia, atuacao, confianca e servicos da AgroMassa. |
| Rodape | Exibir contatos, WhatsApp, localizacao e links uteis. |

### Area Administrativa

| Pagina | Objetivo |
| --- | --- |
| Login Administrativo | Restringir acesso a usuarios autorizados. |
| Dashboard Administrativo | Dar acesso rapido aos modulos de conteudo. |
| Listagem de Produtos | Consultar, buscar, filtrar, editar, remover e alterar status dos produtos. |
| Cadastro de Produto | Criar produto com dados comerciais, tecnicos e fotos. |
| Edicao de Produto | Atualizar informacoes, fotos, status, destaque e visibilidade. |
| Gestao Institucional | Editar nome, descricao, contatos, WhatsApp, cidade/estado, servicos e conteudo sobre a empresa. |

---

## Requisitos Funcionais

### Requisitos Gerais

| ID | Requisito | Prioridade |
| --- | --- | --- |
| GER-01 | O sistema deve ter area publica acessivel sem login. | P1 |
| GER-02 | O sistema deve ter area administrativa protegida por login. | P1 |
| GER-03 | O layout deve ser responsivo e utilizavel em celular, tablet e desktop. | P1 |
| GER-04 | A identidade visual deve seguir a marca AgroMassa, com estilo forte, profissional, robusto e ligado ao agronegocio. | P1 |
| GER-05 | O site deve usar verde, preto, branco e tons neutros como base visual, respeitando a logo. | P2 |
| GER-06 | O sistema deve usar a logo oficial `agromassa.jpeg` como referencia visual da marca. | P1 |
| GER-07 | O conteudo do sistema deve ser persistido em banco de dados. | P1 |
| GER-08 | O projeto deve ter painel administrativo proprio no MVP. | P1 |

### Produtos e Catalogo

| ID | Requisito | Prioridade |
| --- | --- | --- |
| PROD-01 | O sistema deve cadastrar produtos nas categorias Tratores e Implementos Agricolas. | P1 |
| PROD-02 | O sistema deve permitir definir tipo ou subcategoria do produto. | P1 |
| PROD-03 | O sistema deve permitir cadastrar produto com dados comerciais e especificacoes tecnicas. | P1 |
| PROD-04 | O sistema deve permitir cadastrar foto principal do produto. | P1 |
| PROD-05 | O sistema deve permitir cadastrar fotos adicionais em galeria, com limite de ate 8 fotos por produto no MVP. | P1 |
| PROD-06 | O sistema deve permitir marcar produto como destaque. | P1 |
| PROD-07 | O sistema deve permitir marcar produto com os status do MVP: disponivel, vendido, sob consulta, alugado e rascunho. | P1 |
| PROD-08 | O sistema deve permitir controlar se um produto aparece ou nao na area publica. | P1 |
| PROD-09 | O preco do produto deve ser opcional. | P1 |
| PROD-10 | Produtos sem preco devem ser exibidos como "Sob consulta" ou rotulo equivalente definido pela AgroMassa. | P1 |
| PROD-11 | O campo ano do produto deve ser opcional. | P1 |
| PROD-12 | A foto principal deve ser obrigatoria para publicacao do produto. | P1 |
| PROD-13 | O administrador deve conseguir salvar produto como rascunho mesmo com campos de publicacao incompletos. | P1 |
| PROD-14 | O sistema deve registrar data de criacao e ultima atualizacao de cada produto. | P1 |
| PROD-15 | Especificacoes tecnicas devem ser mantidas como texto livre no MVP. | P1 |

### WhatsApp e Conversao

| ID | Requisito | Prioridade |
| --- | --- | --- |
| WA-01 | Todo produto exibido publicamente deve ter botao de contato via WhatsApp. | P1 |
| WA-02 | O botao de WhatsApp deve abrir uma conversa com o numero oficial da AgroMassa: `17 99727-8876`. | P1 |
| WA-03 | A mensagem de WhatsApp deve incluir referencia ao produto usando o texto padrao: "Ola, tenho interesse no produto [NOME DO PRODUTO] anunciado no site AgroMassa. Pode me passar mais informacoes?" | P1 |
| WA-04 | A pagina institucional deve exibir numero ou botao de WhatsApp da AgroMassa. | P1 |
| WA-05 | Todo contato de produto no MVP deve usar sempre o mesmo numero da empresa. | P1 |

### Busca e Filtros

| ID | Requisito | Prioridade |
| --- | --- | --- |
| BUS-01 | O visitante deve poder buscar produtos por palavra-chave. | P1 |
| BUS-02 | A busca deve considerar nome, marca, modelo e descricao. | P1 |
| BUS-03 | O visitante deve poder filtrar produtos por categoria. | P1 |
| BUS-04 | O visitante deve poder filtrar produtos por condicao: novo, usado ou seminovo. | P1 |
| BUS-05 | O visitante deve poder filtrar produtos por marca. | P1 |
| BUS-06 | O visitante deve poder filtrar produtos por status. | P1 |
| BUS-07 | O sistema deve exibir estado vazio quando nenhum produto corresponder a busca ou filtros. | P1 |
| BUS-08 | A busca deve ignorar acentos e diferencas entre letras maiusculas e minusculas. | P1 |
| BUS-09 | O catalogo deve ordenar produtos com destaques primeiro e depois por produtos mais recentes. | P1 |

---

## Requisitos da Area Publica

| ID | Requisito | Prioridade |
| --- | --- | --- |
| PUB-01 | A pagina institucional deve exibir nome da empresa, logo, descricao, telefone, WhatsApp e cidade/estado. | P1 |
| PUB-02 | A pagina institucional deve exibir servicos oferecidos: compra, venda, troca e locacao. | P1 |
| PUB-03 | A area publica deve exibir catalogo de produtos em cards ou lista. | P1 |
| PUB-04 | Cada item do catalogo deve exibir informacoes resumidas suficientes para decisao inicial. | P1 |
| PUB-05 | O visitante deve conseguir abrir a pagina ou modal de detalhes do produto. | P1 |
| PUB-06 | A pagina de detalhes deve exibir galeria de fotos do produto. | P1 |
| PUB-07 | A pagina de detalhes deve exibir categoria, tipo/subcategoria, marca, modelo, ano quando houver, condicao, descricao, especificacoes tecnicas, cidade/estado, status e preco quando houver. | P1 |
| PUB-08 | Produtos vendidos, alugados ou indisponiveis devem ter status visual claro para o visitante. | P1 |
| PUB-09 | Produtos ocultos pelo administrador nao devem aparecer na area publica. | P1 |
| PUB-10 | Produtos em destaque devem poder ser apresentados com maior evidencia na area publica. | P1 |
| PUB-11 | O site deve exibir Sao Francisco-SP como localizacao publica inicial da AgroMassa ate que o administrador altere essa informacao. | P1 |

---

## Requisitos da Area Administrativa

| ID | Requisito | Prioridade |
| --- | --- | --- |
| ADM-01 | O administrador deve acessar a area administrativa por login. | P1 |
| ADM-02 | O administrador deve conseguir adicionar produtos. | P1 |
| ADM-03 | O administrador deve conseguir editar produtos existentes. | P1 |
| ADM-04 | O administrador deve conseguir arquivar ou inativar produtos sem exclusao definitiva no MVP. | P1 |
| ADM-05 | O administrador deve conseguir cadastrar foto principal e fotos adicionais. | P1 |
| ADM-06 | O administrador deve conseguir alterar status do produto. | P1 |
| ADM-07 | O administrador deve conseguir marcar ou desmarcar produto como destaque. | P1 |
| ADM-08 | O administrador deve conseguir controlar a visibilidade publica do produto. | P1 |
| ADM-09 | O administrador deve conseguir editar informacoes institucionais da AgroMassa. | P1 |
| ADM-10 | A listagem administrativa deve permitir localizar produtos para manutencao. | P2 |
| ADM-11 | O sistema deve validar campos obrigatorios de publicacao antes de permitir publicar produto. | P1 |
| ADM-12 | O sistema deve impedir acesso administrativo sem autenticacao valida. | P1 |
| ADM-13 | O MVP deve operar com apenas 1 administrador. | P1 |
| ADM-14 | Recuperacao de senha fica fora do MVP. | P1 |
| ADM-15 | O administrador deve poder salvar rascunhos incompletos. | P1 |
| ADM-16 | A area administrativa deve exibir data de criacao e ultima atualizacao do produto. | P2 |

---

## Regras de Negocio

| ID | Regra |
| --- | --- |
| RN-01 | O site nao deve permitir compra online. |
| RN-02 | O site nao deve ter carrinho de compras. |
| RN-03 | O site nao deve processar pagamentos online. |
| RN-04 | Todo interesse comercial deve ser direcionado para WhatsApp. |
| RN-05 | Todo produto publico deve possuir chamada de contato via WhatsApp. |
| RN-06 | Todo produto publico deve permitir exibicao de pelo menos uma foto. |
| RN-07 | A area publica deve ser apenas para visualizacao, consulta e contato. |
| RN-08 | A area administrativa deve ser exclusiva para gestao de conteudo. |
| RN-09 | Produtos ocultos administrativamente nao devem aparecer no catalogo publico. |
| RN-10 | Produtos vendidos, alugados ou indisponiveis podem continuar visiveis somente se a AgroMassa escolher essa exibicao. |
| RN-11 | Preco e informacoes de negociacao nao devem ser tratados como fechamento de venda no site. |
| RN-12 | O WhatsApp configurado deve ser a fonte unica de contato comercial direto no MVP, salvo contatos institucionais exibidos no rodape. |
| RN-13 | Produto em rascunho nao deve aparecer publicamente. |
| RN-14 | Produto so pode ser publicado se tiver foto principal e campos obrigatorios de publicacao preenchidos. |
| RN-15 | Status "alugado" indica produto temporariamente indisponivel ou voltado para locacao. |
| RN-16 | Produtos vendidos podem continuar visiveis na area publica se o administrador mantiver sua exibicao ativa. |
| RN-17 | O preco, quando preenchido, deve ser exibido publicamente. |
| RN-18 | Exclusao de produto no MVP deve ser logica, por arquivamento ou inativacao, sem apagar definitivamente o registro. |
| RN-19 | O catalogo publico deve priorizar produtos em destaque e depois produtos mais recentes. |

---

## Campos do Cadastro de Produtos

| Campo | Obrigatorio no MVP | Observacoes |
| --- | --- | --- |
| ID | Sim | Identificador unico do produto. |
| Nome do produto | Sim | Nome exibido no catalogo e detalhes. |
| Categoria | Sim | Tratores ou Implementos Agricolas. |
| Tipo/Subcategoria | Sim | Ex.: grade, arado, plantadeira, pulverizador, carreta agricola, rocadeira, subsolador, distribuidor, outros. |
| Marca | Sim | Usada tambem na busca e filtros. |
| Modelo | Sim | Usado tambem na busca. |
| Ano | Nao | Campo opcional no MVP. |
| Condicao do produto | Sim | Novo, usado ou seminovo. |
| Descricao | Sim | Texto comercial para o visitante. |
| Especificacoes tecnicas | Sim | Campo em texto livre no MVP. |
| Preco | Nao | Campo opcional; quando ausente, exibir "Sob consulta" ou equivalente. |
| Status do produto | Sim | Disponivel, vendido, sob consulta, alugado ou rascunho. |
| Cidade/estado | Sim | Localizacao do produto. |
| Destaque | Sim | Sim ou nao. |
| Visivel no site | Sim | Controla se aparece na area publica. |
| Foto principal | Sim | Imagem principal em cards e detalhes; obrigatoria para publicar. |
| Fotos adicionais / galeria | Nao | Ate 8 fotos por produto no MVP. |
| Link ou botao de WhatsApp | Sim | Pode ser gerado a partir do produto e numero da empresa. |
| Data de criacao | Sim | Registro automatico do sistema. |
| Ultima atualizacao | Sim | Registro automatico do sistema. |
| Estado de arquivamento/inativacao | Sim | Controla remocao logica sem exclusao definitiva. |

---

## Busca e Filtros

### Busca por Texto

A busca deve aceitar palavra-chave e consultar, no minimo:

- Nome do produto
- Marca
- Modelo
- Descricao

### Filtros P1

- Categoria: Tratores, Implementos Agricolas
- Condicao: novo, usado, seminovo
- Marca
- Status: disponivel, vendido, sob consulta, alugado ou outros definidos

### Comportamentos Esperados

- A busca e os filtros devem poder funcionar em conjunto.
- A busca deve ignorar acentos e diferencas entre letras maiusculas e minusculas.
- Quando nao houver resultados, o sistema deve exibir mensagem clara de nenhum produto encontrado.
- O visitante deve conseguir limpar busca e filtros para voltar ao catalogo completo.
- A aplicacao deve evitar mostrar produtos ocultos na area publica, mesmo quando busca ou filtros corresponderem.
- O catalogo deve ordenar destaques primeiro e, depois, os produtos mais recentes.

---

## User Stories

### P1 - Consultar catalogo publico

Como visitante, quero ver os produtos disponiveis da AgroMassa para avaliar tratores e implementos antes de entrar em contato.

Critérios de aceite:

1. WHEN o visitante acessa o catalogo THEN o sistema SHALL listar produtos visiveis publicamente.
2. WHEN um produto estiver oculto pelo administrador THEN o sistema SHALL nao exibir esse produto no catalogo publico.
3. WHEN um produto tiver status diferente de disponivel THEN o sistema SHALL exibir o status de forma clara.

Teste independente: acessar a pagina de catalogo e confirmar que produtos cadastrados e visiveis aparecem com dados resumidos.

### P1 - Ver detalhes do produto

Como visitante, quero abrir os detalhes de um produto para analisar fotos, dados tecnicos e condicoes.

Critérios de aceite:

1. WHEN o visitante seleciona um produto THEN o sistema SHALL exibir pagina ou modal de detalhes.
2. WHEN o produto possui foto principal e galeria THEN o sistema SHALL exibir as imagens no detalhe.
3. WHEN o produto nao possui preco THEN o sistema SHALL exibir indicacao de consulta em vez de valor vazio.
4. WHEN o produto possui preco preenchido THEN o sistema SHALL exibir o valor publicamente.

Teste independente: abrir um produto e validar informacoes, fotos e botao de WhatsApp.

### P1 - Entrar em contato via WhatsApp

Como visitante interessado, quero chamar a AgroMassa pelo WhatsApp a partir de um produto para iniciar negociacao.

Critérios de aceite:

1. WHEN o visitante clica no botao de WhatsApp de um produto THEN o sistema SHALL abrir conversa com o numero `17 99727-8876`.
2. WHEN a conversa for aberta THEN o sistema SHALL incluir a mensagem padrao com o nome do produto.
3. WHEN o visitante estiver na pagina institucional THEN o sistema SHALL oferecer contato por WhatsApp.

Teste independente: clicar no botao de WhatsApp e verificar numero e texto da mensagem.

### P1 - Administrar produtos

Como administrador, quero cadastrar e editar produtos para manter o catalogo atualizado.

Critérios de aceite:

1. WHEN o administrador salva um produto como rascunho THEN o sistema SHALL permitir o salvamento mesmo com campos de publicacao incompletos.
2. WHEN o administrador tenta publicar um produto sem foto principal ou sem campos obrigatorios de publicacao THEN o sistema SHALL impedir a publicacao e indicar os campos com erro.
3. WHEN o administrador altera status, destaque ou visibilidade THEN o sistema SHALL refletir a mudanca na area publica conforme a regra aplicavel.

Teste independente: cadastrar um produto, editar seu status e confirmar mudanca no catalogo.

### P1 - Administrar informacoes institucionais

Como administrador, quero editar informacoes da empresa para manter dados de contato e apresentacao atualizados.

Critérios de aceite:

1. WHEN o administrador atualiza nome, descricao, contatos, WhatsApp ou cidade/estado THEN o sistema SHALL salvar as alteracoes.
2. WHEN a area publica for acessada apos a edicao THEN o sistema SHALL exibir as informacoes atualizadas.

Teste independente: alterar o WhatsApp ou descricao e validar a pagina publica.

### P2 - Destacar produtos

Como administrador, quero marcar produtos como destaque para dar mais visibilidade aos itens prioritarios.

Critérios de aceite:

1. WHEN um produto for marcado como destaque THEN o sistema SHALL permitir apresenta-lo com maior evidencia na area publica.
2. WHEN o destaque for removido THEN o sistema SHALL retornar o produto ao comportamento normal de listagem.
3. WHEN houver produtos em destaque e produtos comuns THEN o sistema SHALL listar destaques antes dos demais.

Teste independente: marcar produto como destaque e validar exibicao publica diferenciada.

---

## Critérios de Aceite do MVP

### Area Publica

1. WHEN um visitante acessa o site THEN o sistema SHALL exibir pagina institucional da AgroMassa com logo, descricao, servicos, telefone, WhatsApp e cidade/estado.
2. WHEN um visitante acessa o catalogo THEN o sistema SHALL exibir produtos cadastrados e visiveis publicamente.
3. WHEN um visitante busca por nome, marca, modelo ou descricao THEN o sistema SHALL retornar produtos correspondentes ignorando acentos e caixa.
4. WHEN um visitante filtra por categoria, condicao, marca ou status THEN o sistema SHALL atualizar a listagem conforme os filtros.
5. WHEN nenhum produto corresponder a busca ou filtros THEN o sistema SHALL exibir estado vazio claro.
6. WHEN um visitante abre detalhes de produto THEN o sistema SHALL exibir informacoes completas e galeria de fotos.
7. WHEN um visitante clica em contato via WhatsApp THEN o sistema SHALL iniciar conversa com a mensagem padrao e referencia ao produto.
8. WHEN houver produtos em destaque THEN o sistema SHALL apresenta-los antes dos demais produtos.

### Area Administrativa

1. WHEN uma pessoa sem autenticacao tenta acessar a area administrativa THEN o sistema SHALL bloquear o acesso.
2. WHEN o administrador faz login com credenciais validas THEN o sistema SHALL permitir acesso a gestao de conteudo.
3. WHEN o administrador salva rascunho incompleto THEN o sistema SHALL permitir o salvamento sem publicar o produto.
4. WHEN o administrador cadastra produto valido para publicacao THEN o sistema SHALL salvar e permitir sua exibicao publica conforme visibilidade.
5. WHEN o administrador arquiva ou inativa produto THEN o sistema SHALL retirar o produto da area publica conforme regra de visibilidade e status.
6. WHEN o administrador envia fotos THEN o sistema SHALL associar no maximo 8 imagens ao produto correto.
7. WHEN o administrador edita informacoes institucionais THEN o sistema SHALL refletir os dados atualizados no site publico.
8. WHEN o administrador consulta um produto na area administrativa THEN o sistema SHALL poder visualizar data de criacao e ultima atualizacao.

### Regras Comerciais

1. WHEN o visitante demonstrar interesse em um produto THEN o sistema SHALL direcionar para WhatsApp, nao para checkout.
2. WHEN o produto tiver preco ausente THEN o sistema SHALL indicar consulta em vez de impedir exibicao.
3. WHEN produto estiver vendido, alugado ou sob consulta THEN o sistema SHALL comunicar o status claramente.

---

## Traceabilidade Inicial

| ID | Origem | Area | Status |
| --- | --- | --- | --- |
| GER-01 a GER-08 | Ideia inicial + Clarify | Geral | Clarificado |
| PUB-01 a PUB-11 | Ideia inicial + Clarify | Publica | Clarificado |
| ADM-01 a ADM-16 | Ideia inicial + Clarify | Administrativa | Clarificado |
| PROD-01 a PROD-15 | Ideia inicial + Clarify | Produtos | Clarificado |
| BUS-01 a BUS-09 | Ideia inicial + Clarify | Busca e filtros | Clarificado |
| WA-01 a WA-05 | Ideia inicial + Clarify | WhatsApp | Clarificado |
| RN-01 a RN-19 | Ideia inicial + Clarify | Regras de negocio | Clarificado |

---

## Decisoes da fase Clarify

### Marca e conteudo institucional

- A logo oficial do projeto e o arquivo `agromassa.jpeg`.
- O sistema deve nascer com um texto institucional inicial editavel.
- Os contatos publicos do MVP serao WhatsApp, telefone e cidade/estado.
- A localizacao inicial publica sera Sao Francisco-SP.

### WhatsApp comercial

- O numero oficial da AgroMassa sera `17 99727-8876`.
- Todo contato de produto usara o mesmo numero da empresa.
- A mensagem padrao sera: "Ola, tenho interesse no produto [NOME DO PRODUTO] anunciado no site AgroMassa. Pode me passar mais informacoes?"

### Produtos e publicacao

- O campo ano sera opcional.
- Foto principal sera obrigatoria para publicar um produto.
- O administrador podera salvar rascunhos incompletos.
- Os status do MVP serao: disponivel, vendido, sob consulta, alugado e rascunho.
- O status "alugado" representa produto temporariamente indisponivel ou voltado para locacao.
- Produtos vendidos podem continuar aparecendo se o administrador quiser, com status visual claro.
- O preco, quando preenchido, deve aparecer publicamente.
- Especificacoes tecnicas serao texto livre no MVP.
- O produto tera ate 8 fotos no MVP.
- Exclusao de produto sera por arquivamento ou inativacao, sem apagar definitivamente.
- O sistema registrara data de criacao e ultima atualizacao do produto.

### Catalogo e busca

- O catalogo deve ordenar destaques primeiro e depois produtos mais recentes.
- A busca deve ignorar acentos e diferencas entre maiusculas e minusculas.
- Marca e status entram no MVP como filtros obrigatorios.

### Area administrativa e operacao

- O MVP tera apenas 1 administrador.
- Recuperacao de senha fica fora do MVP.
- O projeto deve ter painel administrativo proprio.
- O conteudo deve ser persistido em banco de dados.
- O site ainda nao tem hospedagem definida.
- Nao ha prazo ou orcamento definido no momento.

---

## Duvidas Pendentes Antes do Design Tecnico

As definicoes de Clarify foram incorporadas. Restam apenas decisoes tecnicas para a fase de Design, nao duvidas de produto bloqueando a especificacao funcional.

- Hospedagem ainda nao definida.
- A modelagem do banco de dados sera detalhada na fase de Design.
- A estrategia de autenticacao do administrador sera definida na fase de Design.
- O formato exato do painel administrativo proprio sera definido na fase de Design.

---

## Condicao Para Avancar

A fase Specify foi concluida. O projeto pode avancar para Design quando:

- A AgroMassa validar que os objetivos e escopo do MVP estao corretos.
- As decisoes registradas na fase Clarify forem aceitas como base do projeto.
- Os requisitos P1 confirmados nesta spec forem usados como entrada do design tecnico.
