"use client";

import { useState, useTransition } from "react";

import { useToast } from "@/components/ui/toast-provider";
import {
  deleteProductImageAction,
  setMainProductImageAction,
} from "@/features/products/admin-product-actions";

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
  onImageDeleted: (input: {
    nextMainImageId: string | null;
    removedImageId: string;
    removedWasMain: boolean;
  }) => void;
  onMainImageChange: (imageId: string) => void;
  productId: string;
};

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ProductImageGallery({
  images,
  mainImageId,
  onImageDeleted,
  onMainImageChange,
  productId,
}: ProductImageGalleryProps) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [imageToDelete, setImageToDelete] = useState<{
    id: string;
    isMain: boolean;
    originalFilename: string;
  } | null>(null);

  function handleSetMain(imageId: string) {
    startTransition(async () => {
      const result = await setMainProductImageAction({
        imageId,
        productId,
      });

      if (!result.ok) {
        showToast({
          message:
            result.formError ??
            "Nao foi possivel concluir a acao. Tente novamente.",
          tone: "error",
        });
        return;
      }

      onMainImageChange(imageId);
      showToast({
        message: "Imagem principal atualizada.",
        tone: "success",
      });
    });
  }

  function handleDeleteImage() {
    if (!imageToDelete) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProductImageAction({
        imageId: imageToDelete.id,
        productId,
      });

      if (!result.ok) {
        showToast({
          message:
            result.formError ??
            "Nao foi possivel concluir a acao. Tente novamente.",
          tone: "error",
        });
        return;
      }

      onImageDeleted({
        nextMainImageId: result.nextMainImageId,
        removedImageId: result.removedImageId,
        removedWasMain: result.removedWasMain,
      });
      setImageToDelete(null);
      showToast({
        message:
          result.removedWasMain && !result.nextMainImageId
            ? "Imagem removida. Defina uma nova principal para manter a exibicao publica."
            : "Imagem removida com sucesso.",
        tone:
          result.removedWasMain && !result.nextMainImageId
            ? "validation"
            : "success",
      });
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => {
          const isMain = image.id === mainImageId || image.isMain;

          return (
            <article
              className={`overflow-hidden rounded-lg border bg-white ${
                isMain
                  ? "border-agromassa-green shadow-[0_0_0_1px_rgba(57,179,26,0.18)]"
                  : "border-agromassa-border"
              }`}
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
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="truncate text-sm font-black text-agromassa-ink">
                      {image.originalFilename}
                    </p>
                    {isMain ? (
                      <span className="inline-flex min-h-7 items-center justify-center rounded-md bg-agromassa-green px-2 text-[10px] font-black uppercase text-white">
                        Principal
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs font-bold text-agromassa-muted">
                    {image.mimeType} • {formatFileSize(image.fileSizeBytes)}
                  </p>
                </div>

                {isMain ? (
                  <p className="rounded-md border border-agromassa-green bg-[#effbe9] px-3 py-2 text-xs font-bold leading-5 text-agromassa-forest">
                    Esta imagem aparece como principal no formulario e no catalogo.
                  </p>
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

                <button
                  className="inline-flex min-h-9 items-center justify-center rounded-md border border-red-200 px-3 text-xs font-black text-red-700 transition hover:border-red-600 disabled:cursor-not-allowed disabled:bg-agromassa-cream disabled:text-agromassa-muted"
                  disabled={isPending}
                  onClick={() =>
                    setImageToDelete({
                      id: image.id,
                      isMain,
                      originalFilename: image.originalFilename,
                    })
                  }
                  type="button"
                >
                  Excluir imagem
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {imageToDelete ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-lg border border-agromassa-border bg-white p-5 shadow-xl">
            <p className="text-sm font-black uppercase text-agromassa-green">
              Confirmacao
            </p>
            <h3 className="mt-2 text-2xl font-black text-agromassa-ink">
              Excluir imagem?
            </h3>
            <p className="mt-3 text-sm leading-6 text-agromassa-muted">
              Remova{" "}
              <span className="font-black text-agromassa-ink">
                {imageToDelete.originalFilename}
              </span>{" "}
              desta galeria.
            </p>
            {imageToDelete.isMain ? (
              <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold leading-5 text-amber-800">
                Esta e a imagem principal. Se nao houver outra foto para assumir esse lugar, o produto pode deixar de aparecer publicamente.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
                disabled={isPending}
                onClick={() => setImageToDelete(null)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-red-700 px-4 text-sm font-black text-white transition hover:bg-red-800"
                disabled={isPending}
                onClick={handleDeleteImage}
                type="button"
              >
                Confirmar exclusao
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
