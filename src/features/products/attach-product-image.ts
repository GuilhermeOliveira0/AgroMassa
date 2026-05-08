import { prisma } from "@/lib/db/prisma";

import { setMainProductImage } from "./set-main-image";

export type AttachProductImageInput = {
  adminId: string;
  fileSizeBytes: number;
  height?: number | null;
  isMain: boolean;
  mimeType: string;
  originalFilename: string;
  productId: string;
  publicUrl: string;
  storageKey: string;
  width?: number | null;
};

export async function validateProductImageAttachmentTarget(productId: string) {
  const product = await prisma.product.findUnique({
    select: {
      id: true,
    },
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Produto nao encontrado.");
  }

  const imageCount = await prisma.productImage.count({
    where: {
      productId,
    },
  });

  if (imageCount >= 8) {
    throw new Error("Limite de 8 imagens por produto atingido.");
  }

  return imageCount;
}

export async function attachProductImage(input: AttachProductImageInput) {
  const imageCount = await validateProductImageAttachmentTarget(input.productId);

  const image = await prisma.productImage.create({
    data: {
      fileSizeBytes: input.fileSizeBytes,
      height: input.height ?? null,
      isMain: false,
      mimeType: input.mimeType,
      originalFilename: input.originalFilename,
      productId: input.productId,
      publicUrl: input.publicUrl,
      sortOrder: imageCount,
      storageKey: input.storageKey,
      width: input.width ?? null,
    },
    select: {
      fileSizeBytes: true,
      height: true,
      id: true,
      isMain: true,
      mimeType: true,
      originalFilename: true,
      publicUrl: true,
      sortOrder: true,
      storageKey: true,
      width: true,
    },
  });

  if (!input.isMain) {
    return image;
  }

  await setMainProductImage({
    adminId: input.adminId,
    imageId: image.id,
    productId: input.productId,
  });

  return {
    ...image,
    isMain: true,
  };
}
