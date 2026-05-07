import Image from "next/image";
import Link from "next/link";

const navigationItems = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Visao geral",
    isAvailable: true,
  },
  {
    href: "/admin/produtos",
    label: "Produtos",
    description: "Cadastro e catalogo",
    isAvailable: false,
  },
  {
    href: "/admin/institucional",
    label: "Institucional",
    description: "Dados da empresa",
    isAvailable: false,
  },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-agromassa-border bg-agromassa-ink text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-6">
        <Image
          alt="AgroMassa"
          className="h-12 w-12 rounded-md border border-white/12 object-cover"
          height={48}
          priority
          src="/brand/agromassa.jpeg"
          width={48}
        />
        <div className="min-w-0">
          <p className="text-lg font-black leading-tight">AgroMassa</p>
          <p className="mt-1 text-xs font-bold uppercase text-white/55">
            Admin
          </p>
        </div>
      </div>

      <nav aria-label="Navegacao administrativa" className="grid gap-2 px-4 pb-4 sm:px-6 lg:px-4">
        {navigationItems.map((item) =>
          item.isAvailable ? (
            <Link
              className="rounded-lg border border-white/10 bg-white/8 px-4 py-3 transition hover:border-agromassa-green"
              href={item.href}
              key={item.href}
            >
              <span className="block text-sm font-black">{item.label}</span>
              <span className="mt-1 block text-xs font-semibold text-white/58">
                {item.description}
              </span>
            </Link>
          ) : (
            <div
              aria-disabled="true"
              className="rounded-lg border border-white/8 px-4 py-3 text-white/55"
              key={item.href}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black">{item.label}</span>
                <span className="rounded-md bg-white/8 px-2 py-1 text-[11px] font-black uppercase">
                  Em breve
                </span>
              </div>
              <span className="mt-1 block text-xs font-semibold">
                {item.description}
              </span>
            </div>
          ),
        )}
      </nav>
    </aside>
  );
}
