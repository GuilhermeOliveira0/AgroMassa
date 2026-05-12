import { ProductStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import type { AdminQuickProductActionInput } from "@/validators/products/admin-quick-action";

import { getProductPublicationBlockReason } from "./product-publication-readiness";

export type UpdateProductQuickActionResult =
  | {
      ok: true;
    }
  | {
      formError: string;
      ok: false;
    };

const quickActionProductSelect = {
  brand: true,
  category: true,
  city: true,
  condition: true,
  description: true,
  id: true,
  isArchived: true,
  isFeatured: true,
  isPublicVisible: true,
  mainImageId: true,
  model: true,
  publishedAt: true,
  slug: true,
  state: true,
  status: true,
  subcategory: true,
  technicalSpecs: true,
} satisfies Prisma.ProductSelect;

export async function updateProductQuickAction({
  adminId,
  input,
}: {
  adminId: string;
  input: AdminQuickProductActionInput;
}): Promise<UpdateProductQuickActionResult> {
  const product = await prisma.product.findUnique({
    select: quickActionProductSelect,
    where: {
      id: input.productId,
    },
  });

  if (!product) {
    return {
      formError: "Produto nao encontrado.",
      ok: false,
    };
  }

  const publicationBlockReason = getProductPublicationBlockReason(product);
  let data: Prisma.ProductUncheckedUpdateInput;

  switch (input.type) {
    case "status": {
      if (
        input.status !== "RASCUNHO" &&
        product.status === ProductStatus.RASCUNHO &&
        publicationBlockReason
      ) {
        return {
          formError: publicationBlockReason,
          ok: false,
        };
      }

      data = {
        isPublicVisible:
          input.status === "RASCUNHO" ? false : product.isPublicVisible,
        publishedAt:
          input.status === "RASCUNHO"
            ? null
            : (product.publishedAt ?? new Date()),
        status: input.status as ProductStatus,
        updatedByAdminId: adminId,
      };
      break;
    }
    case "visibility": {
      if (input.isPublicVisible && product.isArchived) {
        return {
          formError: "Desarquive o produto antes de deixa-lo visivel no site.",
          ok: false,
        };
      }

      if (input.isPublicVisible && product.status === ProductStatus.RASCUNHO) {
        return {
          formError: "Tire o produto de rascunho antes de deixa-lo visivel.",
          ok: false,
        };
      }

      if (input.isPublicVisible && publicationBlockReason) {
        return {
          formError: publicationBlockReason,
          ok: false,
        };
      }

      data = {
        isPublicVisible: input.isPublicVisible,
        updatedByAdminId: adminId,
      };
      break;
    }
    case "featured": {
      data = {
        isFeatured: input.isFeatured,
        updatedByAdminId: adminId,
      };
      break;
    }
    case "archive": {
      data = {
        isArchived: input.isArchived,
        isPublicVisible: input.isArchived ? false : product.isPublicVisible,
        updatedByAdminId: adminId,
      };
      break;
    }
  }

  await prisma.product.update({
    data,
    where: {
      id: product.id,
    },
  });

  return {
    ok: true,
  };
}
