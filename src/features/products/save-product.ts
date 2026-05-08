import {
  ProductCategory,
  ProductCondition,
  ProductStatus,
  type Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { normalizeSearchText } from "@/lib/search/normalize";
import type { AdminProductFormInput } from "@/validators/products/admin-product";

export type SaveProductResult =
  | {
      ok: true;
      productId: string;
    }
  | {
      fieldErrors?: Partial<Record<keyof AdminProductFormInput, string>>;
      formError: string;
      ok: false;
    };

function toNullableString(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function toSlug(value: string) {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

function toPriceCents(value: string) {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return null;
  }

  return Math.round(Number.parseFloat(normalized) * 100);
}

function toYear(value: string) {
  return value ? Number.parseInt(value, 10) : null;
}

function buildSearchText(input: AdminProductFormInput) {
  return normalizeSearchText(
    [input.name, input.brand, input.model, input.description]
      .filter(Boolean)
      .join(" "),
  );
}

function productStatus(input: AdminProductFormInput) {
  if (input.intent === "draft") {
    return ProductStatus.RASCUNHO;
  }

  return input.status as ProductStatus;
}

function productSlug(input: AdminProductFormInput) {
  return toSlug(input.slug || input.name);
}

async function slugExists(slug: string, productId?: string) {
  const product = await prisma.product.findUnique({
    select: {
      id: true,
    },
    where: {
      slug,
    },
  });

  return Boolean(product && product.id !== productId);
}

async function mainImageBelongsToProduct(
  mainImageId: string | null,
  productId?: string,
) {
  if (!mainImageId) {
    return true;
  }

  if (!productId) {
    return false;
  }

  const image = await prisma.productImage.findUnique({
    select: {
      productId: true,
    },
    where: {
      id: mainImageId,
    },
  });

  if (!image) {
    return false;
  }

  return image.productId === productId;
}

function buildProductData(
  input: AdminProductFormInput,
  adminId: string,
): Prisma.ProductUncheckedCreateInput {
  const status = productStatus(input);

  return {
    brand: toNullableString(input.brand),
    category: input.category ? (input.category as ProductCategory) : null,
    city: toNullableString(input.city),
    condition: input.condition ? (input.condition as ProductCondition) : null,
    createdByAdminId: adminId,
    description: toNullableString(input.description),
    isArchived: input.isArchived,
    isFeatured: input.isFeatured,
    isPublicVisible: input.intent === "draft" ? false : input.isPublicVisible,
    mainImageId: toNullableString(input.mainImageId),
    model: toNullableString(input.model),
    name: input.name.trim(),
    priceCents: toPriceCents(input.price),
    priceVisible: input.priceVisible,
    publishedAt: status === ProductStatus.RASCUNHO ? null : new Date(),
    searchTextNormalized: buildSearchText(input),
    slug: productSlug(input),
    state: toNullableString(input.state),
    status,
    subcategory: toNullableString(input.subcategory),
    technicalSpecs: toNullableString(input.technicalSpecs),
    updatedByAdminId: adminId,
    year: toYear(input.year),
  };
}

function buildUpdateData(
  input: AdminProductFormInput,
  adminId: string,
  currentPublishedAt: Date | null,
): Prisma.ProductUncheckedUpdateInput {
  const createData = buildProductData(input, adminId);
  const status = productStatus(input);

  return {
    brand: createData.brand,
    category: createData.category,
    city: createData.city,
    condition: createData.condition,
    description: createData.description,
    isArchived: createData.isArchived,
    isFeatured: createData.isFeatured,
    isPublicVisible: createData.isPublicVisible,
    mainImageId: createData.mainImageId,
    model: createData.model,
    name: createData.name,
    priceCents: createData.priceCents,
    priceVisible: createData.priceVisible,
    publishedAt:
      status === ProductStatus.RASCUNHO
        ? null
        : (currentPublishedAt ?? new Date()),
    searchTextNormalized: createData.searchTextNormalized,
    slug: createData.slug,
    state: createData.state,
    status,
    subcategory: createData.subcategory,
    technicalSpecs: createData.technicalSpecs,
    updatedByAdminId: adminId,
    year: createData.year,
  };
}

export async function saveProduct({
  adminId,
  input,
  productId,
}: {
  adminId: string;
  input: AdminProductFormInput;
  productId?: string;
}): Promise<SaveProductResult> {
  const slug = productSlug(input);

  if (!slug) {
    return {
      fieldErrors: {
        slug: "Informe um slug valido.",
      },
      formError: "Revise os campos destacados.",
      ok: false,
    };
  }

  if (await slugExists(slug, productId)) {
    return {
      fieldErrors: {
        slug: "Este slug ja esta em uso.",
      },
      formError: "Revise os campos destacados.",
      ok: false,
    };
  }

  const mainImageId = toNullableString(input.mainImageId);

  if (!(await mainImageBelongsToProduct(mainImageId, productId))) {
    return {
      fieldErrors: {
        mainImageId:
          "Salve o produto como rascunho e envie uma foto principal antes de publicar.",
      },
      formError: "Revise os campos destacados.",
      ok: false,
    };
  }

  if (!productId) {
    const product = await prisma.product.create({
      data: buildProductData(input, adminId),
      select: {
        id: true,
      },
    });

    return {
      ok: true,
      productId: product.id,
    };
  }

  const currentProduct = await prisma.product.findUnique({
    select: {
      publishedAt: true,
    },
    where: {
      id: productId,
    },
  });

  if (!currentProduct) {
    return {
      formError: "Produto nao encontrado.",
      ok: false,
    };
  }

  const product = await prisma.product.update({
    data: buildUpdateData(input, adminId, currentProduct.publishedAt),
    select: {
      id: true,
    },
    where: {
      id: productId,
    },
  });

  return {
    ok: true,
    productId: product.id,
  };
}
