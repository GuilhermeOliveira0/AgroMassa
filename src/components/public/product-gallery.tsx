"use client";

import { useState } from "react";

import type { PublicProductDetail } from "@/features/products/get-public-product-by-slug";

import { ProductCardImage } from "./product-card-image";

type ProductGalleryProps = {
  images: PublicProductDetail["images"];
  isFeatured: boolean;
  mainImage: PublicProductDetail["mainImage"];
  productName: string;
};

export function ProductGallery({
  images,
  isFeatured,
  mainImage,
  productName,
}: ProductGalleryProps) {
  const galleryImages = images.length > 0 ? images : [mainImage];
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <section aria-label={`Galeria de ${productName}`} className="grid gap-3">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-agromassa-ink">
        <ProductCardImage
          alt={selectedImage.altText}
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          src={selectedImage.publicUrl}
        />
        {isFeatured ? (
          <span className="absolute left-4 top-4 rounded-md bg-agromassa-green px-3 py-1 text-xs font-black uppercase text-white">
            Destaque
          </span>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {galleryImages.map((image) => (
            <button
              aria-label={`Mostrar imagem de ${productName}`}
              aria-pressed={selectedImage.id === image.id}
              className={`group aspect-[4/3] overflow-hidden rounded-md border bg-agromassa-ink transition ${
                selectedImage.id === image.id
                  ? "border-agromassa-green ring-2 ring-agromassa-green"
                  : "border-agromassa-border hover:border-agromassa-forest"
              }`}
              key={image.id}
              onClick={() => setSelectedImage(image)}
              type="button"
            >
              <ProductCardImage
                alt={image.altText}
                sizes="(max-width: 640px) 33vw, 25vw"
                src={image.publicUrl}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
