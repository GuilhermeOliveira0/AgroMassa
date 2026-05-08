import Link from "next/link";

import { getSiteSettings } from "@/features/institutional/get-site-settings";

export default async function AdminDashboardPage() {
  const settings = await getSiteSettings();
  const dashboardCards = [
    {
      label: "Produtos",
      value: "Listagem",
      description: "Localize tratores e implementos cadastrados no banco.",
    },
    {
      label: "Institucional",
      value: settings.companyName,
      description: `${settings.city}, ${settings.state} - ${settings.whatsappDisplay}`,
    },
    {
      label: "Site publico",
      value: "Online",
      description: "Home, catalogo, detalhes e CTAs de WhatsApp ativos.",
    },
  ];

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
              Use este painel para acompanhar os modulos do MVP. As proximas
              etapas conectam listagem, cadastro de produtos, uploads e dados
              institucionais.
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

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {dashboardCards.map((card) => (
          <article
            className="rounded-lg border border-agromassa-border bg-white p-5"
            key={card.label}
          >
            <p className="text-xs font-black uppercase text-agromassa-muted">
              {card.label}
            </p>
            <h3 className="mt-2 text-2xl font-black text-agromassa-forest">
              {card.value}
            </h3>
            <p className="mt-3 text-sm leading-6 text-agromassa-muted">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">
          Modulos administrativos
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-agromassa-border p-4">
            <p className="font-black text-agromassa-ink">Produtos</p>
            <p className="mt-2 text-sm leading-6 text-agromassa-muted">
              Listagem administrativa disponivel. Criacao e edicao entram nas
              proximas tasks do roadmap.
            </p>
            <Link
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
              href="/admin/produtos"
            >
              Abrir produtos
            </Link>
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
