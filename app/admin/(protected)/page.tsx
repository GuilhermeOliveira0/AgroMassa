import Link from "next/link";

import { getSiteSettings } from "@/features/institutional/get-site-settings";
import { getAdminDashboardMetrics } from "@/features/products/get-admin-dashboard-metrics";

export default async function AdminDashboardPage() {
  const [settings, metrics] = await Promise.all([
    getSiteSettings(),
    getAdminDashboardMetrics(),
  ]);
  const metricCards = [
    {
      label: "Cadastrados",
      value: metrics.totalProducts.toString(),
      description: "Total de produtos registrados no painel administrativo.",
    },
    {
      label: "Publicados",
      value: metrics.publishedProducts.toString(),
      description: "Produtos fora de rascunho e prontos para operacao comercial.",
    },
    {
      label: "Disponiveis",
      value: metrics.availableProducts.toString(),
      description: "Itens com status disponivel, mesmo quando ocultos ou arquivados.",
    },
    {
      label: "Visiveis no site",
      value: metrics.publiclyVisibleProducts.toString(),
      description: "Produtos publicados, com imagem principal e liberados no catalogo.",
    },
    {
      label: "Rascunhos",
      value: metrics.draftProducts.toString(),
      description: "Cadastros que ainda precisam de revisao antes da publicacao.",
    },
    {
      label: "Arquivados",
      value: metrics.archivedProducts.toString(),
      description: "Produtos mantidos fora da operacao ativa sem exclusao definitiva.",
    },
    {
      label: "Destaques",
      value: metrics.featuredProducts.toString(),
      description: "Produtos marcados para ganhar prioridade no catalogo publico.",
    },
    {
      label: "Sem imagem principal",
      value: metrics.productsMissingMainImage.toString(),
      description: "Itens que precisam de imagem principal para evitar bloqueios de publicacao.",
    },
  ];
  const attentionItems = [
    {
      count: metrics.draftProducts,
      cta: "Revisar produtos",
      description: "Rascunhos ainda precisam de conteudo completo para publicacao.",
      href: "/admin/produtos",
      label: "Rascunhos pendentes",
    },
    {
      count: metrics.productsMissingMainImage,
      cta: "Abrir produtos",
      description: "Produtos sem imagem principal nao conseguem sustentar a exibicao publica completa.",
      href: "/admin/produtos",
      label: "Imagens principais pendentes",
    },
  ];
  const hasAttentionItems = attentionItems.some((item) => item.count > 0);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-agromassa-green">
              Dashboard
            </p>
            <h2 className="mt-2 text-3xl font-black text-agromassa-ink">
              Base administrativa da {settings.companyName}.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-agromassa-muted">
              Use este painel para manter produtos, imagens e dados
              institucionais alinhados com o site publico.
            </p>
          </div>

          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-agromassa-forest px-5 text-sm font-black text-white transition hover:bg-agromassa-ink"
            href="/produtos"
          >
            Ver catalogo publico
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-agromassa-green">
              Metricas operacionais
            </p>
            <h2 className="mt-2 text-2xl font-black text-agromassa-ink">
              Visao rapida do catalogo.
            </h2>
          </div>
          <p className="text-sm font-bold text-agromassa-muted">
            {settings.city}, {settings.state} - {settings.whatsappDisplay}
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <article
              className="rounded-lg border border-agromassa-border bg-white p-5"
              key={card.label}
            >
              <p className="text-xs font-black uppercase text-agromassa-muted">
                {card.label}
              </p>
              <h3 className="mt-2 text-3xl font-black text-agromassa-forest">
                {card.value}
              </h3>
              <p className="mt-3 text-sm leading-6 text-agromassa-muted">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-agromassa-green">
              Atencao
            </p>
            <h2 className="mt-2 text-2xl font-black text-agromassa-ink">
              Itens que merecem revisao.
            </h2>
          </div>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
            href="/admin/produtos"
          >
            Abrir listagem de produtos
          </Link>
        </div>

        {hasAttentionItems ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {attentionItems.map((item) => (
              <article
                className="rounded-lg border border-agromassa-border bg-agromassa-cream p-4"
                key={item.label}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase text-agromassa-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 text-3xl font-black text-agromassa-ink">
                      {item.count}
                    </p>
                  </div>
                  <Link
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border bg-white px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
                    href={item.href}
                  >
                    {item.cta}
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-6 text-agromassa-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <article
            className="mt-4 rounded-lg border border-agromassa-border bg-agromassa-cream p-4"
          >
            <p className="text-sm font-black text-agromassa-ink">
              Nenhum alerta imediato no catalogo.
            </p>
            <p className="mt-3 text-sm leading-6 text-agromassa-muted">
              Os produtos ja contam com imagem principal e nao ha rascunhos
              pendentes neste momento.
            </p>
          </article>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">
          Modulos administrativos
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-agromassa-border p-4">
            <p className="font-black text-agromassa-ink">Produtos</p>
            <p className="mt-2 text-sm leading-6 text-agromassa-muted">
              Cadastre, edite, publique, envie imagens e arquive produtos sem
              apagar o historico do catalogo.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
                href="/admin/produtos"
              >
                Abrir produtos
              </Link>
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-agromassa-forest px-4 text-sm font-black text-white transition hover:bg-agromassa-ink"
                href="/admin/produtos/novo"
              >
                Novo produto
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-agromassa-border p-4">
            <p className="font-black text-agromassa-ink">Institucional</p>
            <p className="mt-2 text-sm leading-6 text-agromassa-muted">
              Edite contatos, servicos e texto institucional em uma tela
              dedicada.
            </p>
            <Link
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
              href="/admin/institucional"
            >
              Abrir institucional
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
