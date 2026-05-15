import { CatalogFilters } from "@/components/public/catalog-filters";
import { PublicProductsList } from "@/components/public/public-products-list";
import {
  publicListProductBrands,
  publicListProductsPage,
} from "@/features/products/public-list-products";
import { getSiteSettings } from "@/features/institutional/get-site-settings";
import { parsePublicProductFilters } from "@/validators/products/public-filters";

export const revalidate = 60;

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
  const productListKey = JSON.stringify(filters);

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

          <PublicProductsList
            key={productListKey}
            initialHasMore={productPage.hasMore}
            initialNextPage={productPage.nextPage}
            initialProducts={productPage.products}
            searchParams={currentSearchParams}
            whatsappPhone={settings.whatsappDigits}
          />
        </div>
      </section>
    </main>
  );
}
