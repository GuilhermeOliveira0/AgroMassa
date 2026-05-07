import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

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
    },
  },
  mainImageId: true,
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
  return prisma.product.findUnique({
    select: adminProductDetailSelect,
    where: {
      id,
    },
  });
}
