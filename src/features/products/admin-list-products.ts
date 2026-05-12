import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { getProductImageDisplayUrl } from "@/lib/storage/supabase-storage";

import {
  canProductBePublished,
  getProductPublicationBlockReason,
} from "./product-publication-readiness";

export type AdminProductListFilters = {
  q?: string;
};

export type AdminProductListItem = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string | null;
  condition: string | null;
  status: string;
  isArchived: boolean;
  isFeatured: boolean;
  isPublicVisible: boolean;
  canBePublished: boolean;
  publicationBlockReason: string | null;
  mainImage: {
    publicUrl: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

const adminProductListSelect = {
  id: true,
  slug: true,
  name: true,
  brand: true,
  model: true,
  category: true,
  subcategory: true,
  condition: true,
  description: true,
  technicalSpecs: true,
  status: true,
  isArchived: true,
  isFeatured: true,
  isPublicVisible: true,
  city: true,
  state: true,
  mainImageId: true,
  createdAt: true,
  updatedAt: true,
  mainImage: {
    select: {
      publicUrl: true,
      storageKey: true,
    },
  },
} satisfies Prisma.ProductSelect;

function buildAdminProductWhere(
  filters: AdminProductListFilters,
): Prisma.ProductWhereInput {
  const query = filters.q?.trim();

  if (!query) {
    return {};
  }

  return {
    OR: [
      {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: query,
          mode: "insensitive",
        },
      },
    ],
  };
}

export async function adminListProducts(
  filters: AdminProductListFilters = {},
): Promise<AdminProductListItem[]> {
  const products = await prisma.product.findMany({
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
    select: adminProductListSelect,
    where: buildAdminProductWhere(filters),
  });

  return Promise.all(
    products.map(async (product) => {
      const publicationBlockReason = getProductPublicationBlockReason(product);

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        model: product.model,
        category: product.category,
        condition: product.condition,
        status: product.status,
        isArchived: product.isArchived,
        isFeatured: product.isFeatured,
        isPublicVisible: product.isPublicVisible,
        canBePublished: canProductBePublished(product),
        publicationBlockReason,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        mainImage: product.mainImage
          ? {
              publicUrl: await getProductImageDisplayUrl({
                publicUrl: product.mainImage.publicUrl,
                storageKey: product.mainImage.storageKey,
              }),
            }
          : null,
      };
    }),
  );
}
