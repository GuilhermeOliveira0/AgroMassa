# Checklist final do MVP

Use este checklist antes de entregar ou publicar uma nova versao do AgroMassa.

## Ambiente

- [ ] `.env` local existe e nao esta versionado
- [ ] `.env.example` esta atualizado e sem valores reais
- [ ] `DATABASE_URL` aponta para o banco correto
- [ ] `DIRECT_URL` aponta para conexao direta do banco
- [ ] `AUTH_SECRET` e `NEXTAUTH_SECRET` estao definidos com valores fortes
- [ ] `NEXTAUTH_URL` esta correto para o ambiente
- [ ] `NEXT_PUBLIC_SUPABASE_URL` usa a URL base do Supabase, sem `/rest/v1`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` esta configurada apenas no servidor
- [ ] `SUPABASE_STORAGE_BUCKET` esta como `product-images` ou o nome real do bucket
- [ ] Bucket `product-images` existe no Supabase Storage

## Validacoes tecnicas

- [ ] `npx prisma validate`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`

## Seed e banco

- [ ] Migracoes foram aplicadas no banco correto
- [ ] `npm run prisma:seed` criou ou atualizou o administrador inicial
- [ ] `site_settings` possui nome, logo, textos, telefone, WhatsApp, cidade e estado
- [ ] Admin inicial consegue autenticar

## Fluxo publico

- [ ] `/` abre sem erro
- [ ] Header exibe marca e navegacao
- [ ] Home exibe texto institucional, servicos e contato
- [ ] Card de contato mostra WhatsApp e telefone juntos
- [ ] Rodape exibe ano e direitos reservados
- [ ] `/produtos` lista apenas produtos publicos validos
- [ ] Busca por texto funciona
- [ ] Filtros por categoria, condicao, marca e status funcionam
- [ ] Botao carregar mais funciona quando ha mais produtos
- [ ] Estado vazio aparece quando nao ha resultado
- [ ] Cards exibem imagem, nome, status, preco ou sob consulta
- [ ] Imagem e titulo do card abrem o detalhe
- [ ] `/produtos/[slug]` exibe detalhe completo
- [ ] Galeria publica troca a imagem principal ao clicar nas miniaturas
- [ ] CTAs de WhatsApp abrem com numero e mensagem corretos
- [ ] Produto rascunho nao aparece no publico
- [ ] Produto arquivado nao aparece no publico
- [ ] Produto invisivel nao aparece no publico
- [ ] Produto sem imagem principal nao aparece no publico

## Fluxo administrativo

- [ ] `/admin/login` abre sem erro
- [ ] Login com credenciais validas entra no painel
- [ ] Login invalido mostra erro seguro
- [ ] `/admin` mostra metricas operacionais
- [ ] Dashboard reflete produtos cadastrados, publicados, disponiveis, visiveis, rascunhos, arquivados, destaques e sem imagem principal
- [ ] `/admin/produtos` lista produtos de todos os estados administrativos
- [ ] Busca administrativa funciona
- [ ] Imagem e titulo na listagem abrem a edicao
- [ ] Acoes rapidas alteram status, visibilidade e destaque com toast
- [ ] Arquivar e restaurar na listagem exigem confirmacao
- [ ] `/admin/produtos/novo` salva rascunho com campos minimos
- [ ] Publicar sem campos obrigatorios mostra validacao clara
- [ ] Publicar produto completo funciona
- [ ] Editar produto existente funciona
- [ ] Upload de imagem valida funciona
- [ ] Upload bloqueia tipo invalido
- [ ] Upload bloqueia arquivo acima do limite
- [ ] Upload respeita limite de 8 imagens
- [ ] Imagem principal fica destacada na galeria admin
- [ ] Trocar imagem principal funciona com toast
- [ ] Excluir imagem exige confirmacao
- [ ] Excluir imagem principal promove outra imagem ou limpa `mainImageId` com aviso
- [ ] Remover produto do sistema exige digitar `ARQUIVAR`
- [ ] Produto removido por arquivamento sai do publico
- [ ] `/admin/institucional` salva configuracoes com toast
- [ ] Alteracoes institucionais aparecem na home e no footer

## Responsividade

- [ ] Home funciona em mobile e desktop
- [ ] Catalogo funciona em mobile e desktop
- [ ] Detalhe do produto funciona em mobile e desktop
- [ ] Login admin funciona em mobile e desktop
- [ ] Dashboard admin funciona em mobile e desktop
- [ ] Listagem admin funciona como tabela no desktop e cards no mobile
- [ ] Formulario de produto nao estoura no mobile
- [ ] Galeria/upload admin nao estouram no mobile
- [ ] Institucional admin nao estoura no mobile

## Seguranca e entrega

- [ ] Nenhum segredo real foi commitado
- [ ] `.env` real esta fora do Git
- [ ] `SUPABASE_SERVICE_ROLE_KEY` nao aparece no client
- [ ] Mensagens de erro nao exibem stack trace, token, query ou segredo
- [ ] Upload exige admin autenticado
- [ ] Rotas admin exigem autenticacao
- [ ] Remocao de produto no MVP permanece logica, por arquivamento

## Recomendacoes futuras

- [ ] Planejar limpeza segura de arquivos orfaos no Supabase Storage
- [ ] Considerar testes automatizados para fluxos criticos
- [ ] Avaliar upload assinado se houver limite pratico em runtime
- [ ] Avaliar otimizacao/derivacao de imagens se o catalogo crescer
