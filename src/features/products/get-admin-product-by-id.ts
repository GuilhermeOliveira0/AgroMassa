import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { getProductImageDisplayUrl } from "@/lib/storage/supabase-storage";

const adminProductDetailSelect = {
  brand: true,
  category: true,
  city: true,
  condition: true,
  description: true,
  id: true,
  isArchived: true,
  isFeatured: true,
  isPublicVisible: true,
  mainImage: {
    select: {
      id: true,
      publicUrl: true,
      storageKey: true,
    },
  },
  mainImageId: true,
  images: {
    orderBy: [
      {
        isMain: "desc",
      },
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
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
  },
  model: true,
  name: true,
  priceCents: true,
  priceVisible: true,
  slug: true,
  state: true,
  status: true,
  subcategory: true,
  technicalSpecs: true,
  year: true,
} satisfies Prisma.ProductSelect;

export type AdminProductDetail = Prisma.ProductGetPayload<{
  select: typeof adminProductDetailSelect;
}>;

export async function getAdminProductById(
  id: string,
): Promise<AdminProductDetail | null> {
  const product = await prisma.product.findUnique({
    select: adminProductDetailSelect,
    where: {
      id,
    },
  });

  if (!product) {
    return null;
  }

  const images = await Promise.all(
    product.images.map(async (image) => ({
      ...image,
      publicUrl: await getProductImageDisplayUrl({
        publicUrl: image.publicUrl,
        storageKey: image.storageKey,
      }),
    })),
  );

  return {
    ...product,
    images,
    mainImage: product.mainImage
      ? {
          ...product.mainImage,
          publicUrl: await getProductImageDisplayUrl({
            publicUrl: product.mainImage.publicUrl,
            storageKey: product.mainImage.storageKey,
          }),
        }
      : null,
  };
}
