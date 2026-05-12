import { prisma } from "@/lib/db/prisma";

export class ProductImageDeletionValidationError extends Error {}

export type DeleteProductImageResult = {
  nextMainImageId: string | null;
  removedImageId: string;
  removedWasMain: boolean;
};

export async function deleteProductImage({
  adminId,
  imageId,
  productId,
}: {
  adminId: string;
  imageId: string;
  productId: string;
}): Promise<DeleteProductImageResult> {
  return prisma.$transaction(async (transaction) => {
    const image = await transaction.productImage.findUnique({
      select: {
        id: true,
        isMain: true,
        productId: true,
      },
      where: {
        id: imageId,
      },
    });

    if (!image || image.productId !== productId) {
      throw new ProductImageDeletionValidationError(
        "Imagem nao pertence ao produto informado.",
      );
    }

    const siblingImages = await transaction.productImage.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
        {
          id: "asc",
        },
      ],
      select: {
        id: true,
      },
      where: {
        id: {
          not: imageId,
        },
        productId,
      },
    });

    await transaction.productImage.delete({
      where: {
        id: imageId,
      },
    });

    const nextMainImageId = image.isMain ? (siblingImages[0]?.id ?? null) : null;

    if (image.isMain && nextMainImageId) {
      await transaction.productImage.update({
        data: {
          isMain: true,
        },
        where: {
          id: nextMainImageId,
        },
      });
    }

    await transaction.product.update({
      data: {
        mainImageId: image.isMain ? nextMainImageId : undefined,
        updatedByAdminId: adminId,
      },
      where: {
        id: productId,
      },
    });

    return {
      nextMainImageId,
      removedImageId: imageId,
      removedWasMain: image.isMain,
    };
  });
}
