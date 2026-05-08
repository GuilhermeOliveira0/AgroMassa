import { prisma } from "@/lib/db/prisma";

export async function archiveProduct({
  adminId,
  productId,
}: {
  adminId: string;
  productId: string;
}) {
  return prisma.product.update({
    data: {
      isArchived: true,
      isPublicVisible: false,
      updatedByAdminId: adminId,
    },
    select: {
      id: true,
    },
    where: {
      id: productId,
    },
  });
}
