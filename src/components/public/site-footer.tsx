import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Inicio" },
  { href: "/produtos", label: "Produtos" },
];

export function SiteFooter() {
  return (
    <footer className="bg-agromassa-ink text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <section className="max-w-xl">
          <div className="flex items-center gap-3">
            <Image
              alt="AgroMassa"
              className="h-14 w-14 rounded-md border border-white/15 object-cover"
              height={56}
              src="/brand/agromassa.jpeg"
              width={56}
            />
            <div>
              <p className="text-xl font-black">AgroMassa</p>
              <p className="mt-1 text-sm text-white/65">
                Sao Francisco, SP
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
            Compra, venda, troca e locacao de tratores e implementos
            agricolas.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase text-agromassa-green">
            Contato
          </h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-white/72">
            <p>WhatsApp: 17 99727-8876</p>
            <p>Telefone: 17 99727-8876</p>
            <p>Sao Francisco, SP</p>
          </address>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase text-agromassa-green">
            Navegacao
          </h2>
          <nav aria-label="Links do rodape" className="mt-4 grid gap-2">
            {footerLinks.map((item) => (
              <Link
                className="text-sm text-white/72 transition hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/55">
        AgroMassa. Todos os direitos reservados.
      </div>
    </footer>
  );
}
