import { prisma } from "@/lib/db/prisma";

export async function setMainProductImage({
  adminId,
  imageId,
  productId,
}: {
  adminId: string;
  imageId: string;
  productId: string;
}) {
  return prisma.$transaction(async (transaction) => {
    const image = await transaction.productImage.findUnique({
      select: {
        id: true,
        productId: true,
      },
      where: {
        id: imageId,
      },
    });

    if (!image || image.productId !== productId) {
      throw new Error("Imagem nao pertence ao produto informado.");
    }

    await transaction.productImage.updateMany({
      data: {
        isMain: false,
      },
      where: {
        productId,
      },
    });

    await transaction.productImage.update({
      data: {
        isMain: true,
      },
      where: {
        id: imageId,
      },
    });

    return transaction.product.update({
      data: {
        mainImageId: imageId,
        updatedByAdminId: adminId,
      },
      select: {
        id: true,
        mainImageId: true,
      },
      where: {
        id: productId,
      },
    });
  });
}
