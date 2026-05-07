import Image from "next/image";
import Link from "next/link";

import {
  buildInstitutionalWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";

const navigationItems = [
  { href: "/", label: "Inicio" },
  { href: "/produtos", label: "Produtos" },
];

export function SiteHeader() {
  const whatsappUrl = buildWhatsAppUrl({
    message: buildInstitutionalWhatsAppMessage(),
    phone: "5517997278876",
  });

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          className="flex min-w-0 items-center gap-3 text-agromassa-ink"
          href="/"
        >
          <Image
            alt="AgroMassa"
            className="h-12 w-12 rounded-md border border-black/10 object-cover"
            height={48}
            priority
            src="/brand/agromassa.jpeg"
            width={48}
          />
          <span className="min-w-0">
            <span className="block text-lg font-black leading-none">
              AgroMassa
            </span>
            <span className="mt-1 hidden text-xs font-semibold uppercase text-agromassa-muted sm:block">
              Tratores e implementos agricolas
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegacao publica"
          className="flex items-center gap-1 sm:gap-2"
        >
          {navigationItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-bold text-agromassa-ink transition hover:bg-agromassa-cream hover:text-agromassa-forest"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          {whatsappUrl ? (
            <a
              className="hidden rounded-md bg-agromassa-green px-4 py-2 text-sm font-black text-white transition hover:bg-[#2f9714] sm:inline-flex"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
