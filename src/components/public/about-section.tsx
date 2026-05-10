import {
  buildInstitutionalWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";
import type { PublicSiteSettings } from "@/types/site-settings";

type AboutSectionProps = {
  settings: PublicSiteSettings;
};

const serviceHighlights = ["Compra", "Venda", "Troca", "Locacao"];

export function AboutSection({ settings }: AboutSectionProps) {
  const whatsappUrl = buildWhatsAppUrl({
    message: buildInstitutionalWhatsAppMessage(),
    phone: settings.whatsappDigits,
  });

  return (
    <section className="bg-agromassa-cream px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.82fr]">
        <div>
          <p className="text-sm font-black uppercase text-agromassa-green">
            Institucional
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black text-agromassa-ink sm:text-4xl">
            Atendimento direto para maquinas e implementos agricolas.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-agromassa-muted">
            {settings.servicesText}
          </p>

          <div
            className="mt-8 grid gap-3 sm:grid-cols-2"
            id="servicos"
          >
            {serviceHighlights.map((service) => (
              <div
                className="rounded-lg border border-agromassa-border bg-white px-5 py-4"
                key={service}
              >
                <p className="text-lg font-black text-agromassa-ink">
                  {service}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-agromassa-border bg-white p-6">
          <h2 className="text-sm font-black uppercase text-agromassa-green">
            Contato
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-bold text-agromassa-muted">
                WhatsApp e Telefone
              </dt>
              <dd className="mt-1 text-lg font-black text-agromassa-ink">
                {settings.whatsappDisplay}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-agromassa-muted">Localizacao</dt>
              <dd className="mt-1 text-lg font-black text-agromassa-ink">
                {settings.city}, {settings.state}
              </dd>
            </div>
          </dl>
          {whatsappUrl ? (
            <a
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-agromassa-forest px-5 text-sm font-black text-white transition hover:bg-agromassa-ink"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              Falar com a AgroMassa
            </a>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
