"use client";

import { useState, useTransition } from "react";

import { setMainProductImageAction } from "@/features/products/admin-product-actions";

export type ProductFormImage = {
  fileSizeBytes: number;
  height: number | null;
  id: string;
  isMain: boolean;
  mimeType: string;
  originalFilename: string;
  publicUrl: string;
  sortOrder: number;
  storageKey: string;
  width: number | null;
};

type ProductImageGalleryProps = {
  images: ProductFormImage[];
  mainImageId: string;
  onMainImageChange: (imageId: string) => void;
  productId: string;
};

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ProductImageGallery({
  images,
  mainImageId,
  onMainImageChange,
  productId,
}: ProductImageGalleryProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSetMain(imageId: string) {
    setFeedback(null);

    startTransition(async () => {
      const result = await setMainProductImageAction({
        imageId,
        productId,
      });

      if (!result.ok) {
        setFeedback(result.formError ?? "Nao foi possivel definir a imagem.");
        return;
      }

      onMainImageChange(imageId);
      setFeedback("Imagem principal atualizada.");
    });
  }

  if (images.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-agromassa-border bg-agromassa-cream p-5">
        <p className="text-sm font-bold leading-6 text-agromassa-muted">
          Nenhuma imagem vinculada a este produto.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {feedback ? (
        <p className="rounded-md border border-agromassa-border bg-agromassa-cream px-3 py-2 text-sm font-bold text-agromassa-forest">
          {feedback}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => {
          const isMain = image.id === mainImageId || image.isMain;

          return (
            <article
              className="overflow-hidden rounded-lg border border-agromassa-border bg-white"
              key={image.id}
            >
              <div
                aria-label={image.originalFilename}
                className="aspect-[4/3] bg-agromassa-ink bg-cover bg-center"
                role="img"
                style={{
                  backgroundImage: `url("${image.publicUrl.replaceAll('"', '\\"')}"), url("/brand/agromassa1.jpeg")`,
                }}
              />
              <div className="grid gap-3 p-4">
                <div>
                  <p className="truncate text-sm font-black text-agromassa-ink">
                    {image.originalFilename}
                  </p>
                  <p className="mt-1 text-xs font-bold text-agromassa-muted">
                    {image.mimeType} • {formatFileSize(image.fileSizeBytes)}
                  </p>
                </div>

                {isMain ? (
                  <span className="inline-flex min-h-9 items-center justify-center rounded-md bg-agromassa-green px-3 text-xs font-black uppercase text-white">
                    Principal
                  </span>
                ) : (
                  <button
                    className="inline-flex min-h-9 items-center justify-center rounded-md border border-agromassa-border px-3 text-xs font-black text-agromassa-forest transition hover:border-agromassa-forest"
                    disabled={isPending}
                    onClick={() => handleSetMain(image.id)}
                    type="button"
                  >
                    Definir como principal
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
