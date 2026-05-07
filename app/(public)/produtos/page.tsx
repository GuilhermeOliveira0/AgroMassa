import { CatalogFilters } from "@/components/public/catalog-filters";
import { LoadMoreButton } from "@/components/public/load-more-button";
import { ProductCard } from "@/components/public/product-card";
import {
  publicListProductBrands,
  publicListProductsPage,
} from "@/features/products/public-list-products";
import { getSiteSettings } from "@/features/institutional/get-site-settings";
import { parsePublicProductFilters } from "@/validators/products/public-filters";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const currentSearchParams = (await searchParams) ?? {};
  const filters = parsePublicProductFilters(currentSearchParams);
  const [productPage, brands, settings] = await Promise.all([
    publicListProductsPage(filters),
    publicListProductBrands(),
    getSiteSettings(),
  ]);
  const { hasMore, nextPage, products } = productPage;

  return (
    <main className="bg-agromassa-cream">
      <section className="bg-agromassa-ink px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase text-agromassa-green">
            Catalogo
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Tratores e implementos disponiveis para negociacao.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
            Consulte produtos selecionados pela AgroMassa. A listagem exibe
            apenas itens publicos, completos e liberados para visualizacao.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          <CatalogFilters brands={brands} filters={filters} />

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-agromassa-muted">
              {products.length === 1
                ? "1 produto encontrado"
                : `${products.length} produtos encontrados`}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappPhone={settings.whatsappDigits}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-agromassa-border bg-white px-6 py-12 text-center">
              <p className="text-sm font-black uppercase text-agromassa-green">
                Nenhum produto visivel
              </p>
              <h2 className="mt-3 text-2xl font-black text-agromassa-ink">
                Nenhum produto encontrado.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-agromassa-muted">
                Ajuste os filtros ou limpe a busca para voltar ao catalogo
                completo da AgroMassa.
              </p>
            </div>
          )}

          {hasMore && nextPage ? (
            <LoadMoreButton
              nextPage={nextPage}
              searchParams={currentSearchParams}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
