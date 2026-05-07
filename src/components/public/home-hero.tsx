import Image from "next/image";
import Link from "next/link";

import type { PublicSiteSettings } from "@/features/institutional/get-site-settings";
import {
  buildInstitutionalWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";

type HomeHeroProps = {
  settings: PublicSiteSettings;
};

export function HomeHero({ settings }: HomeHeroProps) {
  const whatsappUrl = buildWhatsAppUrl({
    message: buildInstitutionalWhatsAppMessage(),
    phone: settings.whatsappDigits,
  });
  const location = `${settings.city}, ${settings.state}`;

  return (
    <section className="bg-agromassa-ink text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-black uppercase text-agromassa-green">
            {location}
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none sm:text-6xl lg:text-7xl">
            {settings.companyName}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            {settings.institutionalText}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {whatsappUrl ? (
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-agromassa-green px-5 text-sm font-black text-white transition hover:bg-[#2f9714]"
                href={whatsappUrl}
                rel="noreferrer"
                target="_blank"
              >
                Chamar no WhatsApp
              </a>
            ) : null}
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/18 px-5 text-sm font-black text-white transition hover:border-white/40 hover:bg-white/8"
              href="#servicos"
            >
              Ver servicos
            </Link>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-white/12 bg-white/95 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <Image
              alt={`Logo ${settings.companyName}`}
              className="aspect-square w-full rounded-md object-cover"
              height={520}
              priority
              src={settings.logoPath}
              width={520}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
