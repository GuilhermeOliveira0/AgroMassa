import { ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export type AdminDashboardMetrics = {
  archivedProducts: number;
  availableProducts: number;
  featuredProducts: number;
  productsMissingMainImage: number;
  publiclyVisibleProducts: number;
  publishedProducts: number;
  totalProducts: number;
  draftProducts: number;
};

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const [
    totalProducts,
    publishedProducts,
    availableProducts,
    publiclyVisibleProducts,
    draftProducts,
    archivedProducts,
    featuredProducts,
    productsMissingMainImage,
  ] = await prisma.$transaction([
    prisma.product.count(),
    prisma.product.count({
      where: {
        status: {
          not: ProductStatus.RASCUNHO,
        },
      },
    }),
    prisma.product.count({
      where: {
        status: ProductStatus.DISPONIVEL,
      },
    }),
    prisma.product.count({
      where: {
        isArchived: false,
        isPublicVisible: true,
        mainImageId: {
          not: null,
        },
        status: {
          not: ProductStatus.RASCUNHO,
        },
      },
    }),
    prisma.product.count({
      where: {
        status: ProductStatus.RASCUNHO,
      },
    }),
    prisma.product.count({
      where: {
        isArchived: true,
      },
    }),
    prisma.product.count({
      where: {
        isFeatured: true,
      },
    }),
    prisma.product.count({
      where: {
        mainImageId: null,
      },
    }),
  ]);

  return {
    archivedProducts,
    availableProducts,
    draftProducts,
    featuredProducts,
    productsMissingMainImage,
    publiclyVisibleProducts,
    publishedProducts,
    totalProducts,
  };
}
