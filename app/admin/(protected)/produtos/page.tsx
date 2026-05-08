import Link from "next/link";

import { ProductsTable } from "@/components/admin/products-table";
import { adminListProducts } from "@/features/products/admin-list-products";

export const dynamic = "force-dynamic";

type AdminProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(searchParams: Record<string, string | string[] | undefined>) {
  const value = searchParams.q;

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const currentSearchParams = (await searchParams) ?? {};
  const q = getSearchValue(currentSearchParams).trim();
  const products = await adminListProducts({ q });

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-agromassa-green">
              Produtos
            </p>
            <h1 className="mt-2 text-3xl font-black text-agromassa-ink">
              Listagem administrativa.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-agromassa-muted">
              Consulte produtos publicados, ocultos, arquivados e rascunhos em
              um unico lugar para manter o catalogo sob controle.
            </p>
          </div>

          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-agromassa-forest px-5 text-sm font-black text-white transition hover:bg-agromassa-ink"
            href="/admin/produtos/novo"
          >
            Novo produto
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-agromassa-border bg-white p-4 sm:p-5">
        <form action="/admin/produtos" className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-agromassa-muted">
              Buscar por nome ou marca
            </span>
            <input
              className="min-h-11 rounded-md border border-agromassa-border px-3 text-sm font-bold text-agromassa-ink outline-none transition placeholder:text-agromassa-muted/70 focus:border-agromassa-forest"
              defaultValue={q}
              name="q"
              placeholder="Ex.: John Deere, grade, trator"
              type="search"
            />
          </label>

          <div className="flex items-end gap-2">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-agromassa-green px-5 text-sm font-black text-white transition hover:bg-[#2f9714]"
              type="submit"
            >
              Buscar
            </button>
            {q ? (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
                href="/admin/produtos"
              >
                Limpar
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-agromassa-muted">
            {products.length === 1
              ? "1 produto encontrado"
              : `${products.length} produtos encontrados`}
          </p>
          <p className="text-xs font-bold uppercase text-agromassa-muted">
            Inclui rascunhos, ocultos e arquivados
          </p>
        </div>

        {products.length > 0 ? (
          <ProductsTable products={products} />
        ) : (
          <div className="rounded-lg border border-agromassa-border bg-white px-6 py-12 text-center">
            <p className="text-sm font-black uppercase text-agromassa-green">
              Sem produtos
            </p>
            <h2 className="mt-3 text-2xl font-black text-agromassa-ink">
              Nenhum produto encontrado.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-agromassa-muted">
              {q
                ? "Limpe a busca para revisar toda a base atual."
                : "Use o cadastro de produto para criar um rascunho, enviar imagens e publicar no catalogo."}
            </p>
            {!q ? (
              <Link
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-agromassa-forest px-5 text-sm font-black text-white transition hover:bg-agromassa-ink"
                href="/admin/produtos/novo"
              >
                Criar primeiro produto
              </Link>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
