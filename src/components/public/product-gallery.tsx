import type { PublicProductDetail } from "@/features/products/get-public-product-by-slug";

import { ProductCardImage } from "./product-card-image";

type ProductGalleryProps = {
  product: PublicProductDetail;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const galleryImages =
    product.images.length > 0 ? product.images : [product.mainImage];

  return (
    <section aria-label={`Galeria de ${product.name}`} className="grid gap-3">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-agromassa-ink">
        <ProductCardImage
          alt={product.mainImage.altText}
          src={product.mainImage.publicUrl}
        />
        {product.isFeatured ? (
          <span className="absolute left-4 top-4 rounded-md bg-agromassa-green px-3 py-1 text-xs font-black uppercase text-white">
            Destaque
          </span>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {galleryImages.map((image) => (
            <div
              className="group aspect-[4/3] overflow-hidden rounded-md border border-agromassa-border bg-agromassa-ink"
              key={image.id}
            >
              <ProductCardImage alt={image.altText} src={image.publicUrl} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
