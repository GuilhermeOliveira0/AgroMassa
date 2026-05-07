import { ProductCard } from "@/components/public/product-card";
import { publicListProducts } from "@/features/products/public-list-products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await publicListProducts();

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
        <div className="mx-auto max-w-7xl">
          {products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-agromassa-border bg-white px-6 py-12 text-center">
              <p className="text-sm font-black uppercase text-agromassa-green">
                Nenhum produto visivel
              </p>
              <h2 className="mt-3 text-2xl font-black text-agromassa-ink">
                O catalogo ainda nao tem produtos publicados.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-agromassa-muted">
                Assim que novos tratores e implementos forem liberados pela
                AgroMassa, eles aparecerao aqui.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
