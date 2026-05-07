import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/public/product-detail";
import { ProductGallery } from "@/components/public/product-gallery";
import { getPublicProductBySlug } from "@/features/products/get-public-product-by-slug";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-agromassa-cream">
      <section className="bg-agromassa-ink px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            className="inline-flex min-h-10 items-center rounded-md border border-white/20 px-4 text-sm font-black text-white transition hover:border-agromassa-green hover:text-agromassa-green"
            href="/produtos"
          >
            Voltar ao catalogo
          </Link>
          <p className="mt-6 text-sm font-black uppercase text-agromassa-green">
            Detalhe do produto
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
            {product.name}
          </h1>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start">
          <ProductGallery product={product} />
          <ProductDetail product={product} />
        </div>
      </section>
    </main>
  );
}
