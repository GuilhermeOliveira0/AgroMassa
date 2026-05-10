"use client";

import { type ChangeEvent, useState } from "react";

import { useToast } from "@/components/ui/toast-provider";
import {
  MAX_PRODUCT_IMAGES_PER_PRODUCT,
  PRODUCT_IMAGE_MIME_TYPES,
} from "@/validators/uploads/product-image";

import type { ProductFormImage } from "./product-image-gallery";

type UploadResponse =
  | {
      error: string;
    }
  | {
      image: ProductFormImage;
    };

type ProductImageUploaderProps = {
  disabled?: boolean;
  imageCount: number;
  onImageUploaded: (image: ProductFormImage) => void;
  productId?: string;
};

function getUploadError(payload: UploadResponse) {
  return "error" in payload ? payload.error : null;
}

export function ProductImageUploader({
  disabled = false,
  imageCount,
  onImageUploaded,
  productId,
}: ProductImageUploaderProps) {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const canUpload =
    Boolean(productId) && imageCount < MAX_PRODUCT_IMAGES_PER_PRODUCT && !disabled;

  function getBlockedUploadMessage() {
    if (!productId) {
      return "Salve o produto como rascunho antes de enviar imagens.";
    }

    if (imageCount >= MAX_PRODUCT_IMAGES_PER_PRODUCT) {
      return `Limite de ${MAX_PRODUCT_IMAGES_PER_PRODUCT} imagens atingido.`;
    }

    if (disabled) {
      return "Aguarde a conclusao da acao atual para enviar outra imagem.";
    }

    return null;
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !productId) {
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);
    formData.append("isMain", imageCount === 0 ? "true" : "false");

    try {
      const response = await fetch("/api/admin/uploads", {
        body: formData,
        method: "POST",
      });
      const payload = (await response.json()) as UploadResponse;
      const uploadError = getUploadError(payload);

      if (!response.ok || uploadError) {
        showToast({
          message: uploadError ?? "Nao foi possivel enviar a imagem.",
          tone: response.status >= 500 ? "error" : "validation",
        });
        return;
      }

      if ("image" in payload) {
        onImageUploaded(payload.image);
      }
      showToast({
        message: "Imagem enviada com sucesso.",
        tone: "success",
      });
    } catch {
      showToast({
        message: "Nao foi possivel concluir a acao. Tente novamente.",
        tone: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-agromassa-border bg-agromassa-cream p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-black text-agromassa-ink">
            Enviar imagem do produto
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-agromassa-muted">
            Use JPG, PNG ou WEBP ate 5 MB. O limite do MVP e de{" "}
            {MAX_PRODUCT_IMAGES_PER_PRODUCT} imagens por produto.
          </p>
        </div>

        <label
          className={`inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-black transition ${
            canUpload
              ? "cursor-pointer bg-agromassa-green text-white hover:bg-[#2f9714]"
              : "cursor-not-allowed bg-agromassa-border text-agromassa-muted"
          }`}
          onClick={() => {
            const blockedMessage = getBlockedUploadMessage();

            if (blockedMessage) {
              showToast({
                message: blockedMessage,
                tone: "validation",
              });
            }
          }}
        >
          {isUploading ? "Enviando..." : "Selecionar arquivo"}
          <input
            accept={PRODUCT_IMAGE_MIME_TYPES.join(",")}
            className="sr-only"
            disabled={!canUpload || isUploading}
            onChange={handleFileChange}
            type="file"
          />
        </label>
      </div>

      {!productId ? (
        <p className="mt-4 rounded-md border border-agromassa-border bg-white px-3 py-2 text-sm font-bold text-agromassa-muted">
          Salve o produto como rascunho antes de enviar imagens.
        </p>
      ) : null}

      {imageCount >= MAX_PRODUCT_IMAGES_PER_PRODUCT ? (
        <p className="mt-4 rounded-md border border-agromassa-border bg-white px-3 py-2 text-sm font-bold text-agromassa-muted">
          Limite de {MAX_PRODUCT_IMAGES_PER_PRODUCT} imagens atingido.
        </p>
      ) : null}
    </div>
  );
}
