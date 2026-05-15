import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { getProductImageDisplayUrl } from "@/lib/storage/supabase-storage";

import {
  canProductBePublished,
  getProductPublicationBlockReason,
} from "./product-publication-readiness";

export type AdminProductListFilters = {
  page?: number;
  pageSize?: number;
  q?: string;
};

export const ADMIN_PRODUCTS_PAGE_SIZE = 20;
const ADMIN_PRODUCTS_MAX_PAGE_SIZE = 50;

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

export type AdminProductListPage = {
  page: number;
  pageSize: number;
  products: AdminProductListItem[];
  total: number;
  totalPages: number;
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

function normalizePositiveInteger(value: number | undefined, fallback: number) {
  if (!Number.isInteger(value) || !value || value < 1) {
    return fallback;
  }

  return value;
}

function normalizePageSize(value: number | undefined) {
  const pageSize = normalizePositiveInteger(value, ADMIN_PRODUCTS_PAGE_SIZE);

  return Math.min(pageSize, ADMIN_PRODUCTS_MAX_PAGE_SIZE);
}

export async function adminListProducts(
  filters: AdminProductListFilters = {},
): Promise<AdminProductListPage> {
  const page = normalizePositiveInteger(filters.page, 1);
  const pageSize = normalizePageSize(filters.pageSize);
  const skip = (page - 1) * pageSize;
  const where = buildAdminProductWhere(filters);
  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
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
      skip,
      take: pageSize,
      where,
    }),
  ]);

  const listProducts = await Promise.all(
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

  return {
    page,
    pageSize,
    products: listProducts,
    total,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}
