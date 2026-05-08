"use client";

import { type ChangeEvent, useState } from "react";

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
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const canUpload = Boolean(productId) && imageCount < 8 && !disabled;

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !productId) {
      return;
    }

    setFeedback(null);
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
        setFeedback(uploadError ?? "Nao foi possivel enviar a imagem.");
        return;
      }

      if ("image" in payload) {
        onImageUploaded(payload.image);
      }
      setFeedback("Imagem enviada com sucesso.");
    } catch {
      setFeedback("Nao foi possivel enviar a imagem.");
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
            Use JPG, PNG ou WEBP ate 5 MB. O limite do MVP e de 8 imagens por
            produto.
          </p>
        </div>

        <label
          className={`inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-black transition ${
            canUpload
              ? "cursor-pointer bg-agromassa-green text-white hover:bg-[#2f9714]"
              : "cursor-not-allowed bg-agromassa-border text-agromassa-muted"
          }`}
        >
          {isUploading ? "Enviando..." : "Selecionar arquivo"}
          <input
            accept="image/jpeg,image/png,image/webp"
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

      {imageCount >= 8 ? (
        <p className="mt-4 rounded-md border border-agromassa-border bg-white px-3 py-2 text-sm font-bold text-agromassa-muted">
          Limite de 8 imagens atingido.
        </p>
      ) : null}

      {feedback ? (
        <p className="mt-4 rounded-md border border-agromassa-border bg-white px-3 py-2 text-sm font-bold text-agromassa-forest">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
