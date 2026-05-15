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
  const [metrics] = await prisma.$queryRaw<AdminDashboardMetrics[]>`
    SELECT
      COUNT(*)::int AS "totalProducts",
      COUNT(*) FILTER (WHERE "status" <> 'rascunho')::int AS "publishedProducts",
      COUNT(*) FILTER (WHERE "status" = 'disponivel')::int AS "availableProducts",
      COUNT(*) FILTER (
        WHERE "is_archived" = false
          AND "is_public_visible" = true
          AND "main_image_id" IS NOT NULL
          AND "status" <> 'rascunho'
      )::int AS "publiclyVisibleProducts",
      COUNT(*) FILTER (WHERE "status" = 'rascunho')::int AS "draftProducts",
      COUNT(*) FILTER (WHERE "is_archived" = true)::int AS "archivedProducts",
      COUNT(*) FILTER (WHERE "is_featured" = true)::int AS "featuredProducts",
      COUNT(*) FILTER (WHERE "main_image_id" IS NULL)::int AS "productsMissingMainImage"
    FROM "products"
  `;

  return (
    metrics ?? {
      archivedProducts: 0,
      availableProducts: 0,
      draftProducts: 0,
      featuredProducts: 0,
      productsMissingMainImage: 0,
      publiclyVisibleProducts: 0,
      publishedProducts: 0,
      totalProducts: 0,
    }
  );
}
