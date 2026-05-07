import { ProductStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export type PublicProductListItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  year: number | null;
  condition: string;
  priceCents: number | null;
  priceVisible: boolean;
  status: string;
  city: string;
  state: string;
  isFeatured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  mainImage: {
    id: string;
    publicUrl: string;
    altText: string;
    width: number | null;
    height: number | null;
  };
};

export const publicProductVisibilityWhere = {
  isArchived: false,
  isPublicVisible: true,
  status: {
    not: ProductStatus.RASCUNHO,
  },
  mainImageId: {
    not: null,
  },
  mainImage: {
    isNot: null,
  },
  category: {
    not: null,
  },
  subcategory: {
    not: null,
  },
  brand: {
    not: null,
  },
  model: {
    not: null,
  },
  condition: {
    not: null,
  },
  description: {
    not: null,
  },
  technicalSpecs: {
    not: null,
  },
  city: {
    not: null,
  },
  state: {
    not: null,
  },
} satisfies Prisma.ProductWhereInput;

const publicProductListSelect = {
  id: true,
  slug: true,
  name: true,
  category: true,
  subcategory: true,
  brand: true,
  model: true,
  year: true,
  condition: true,
  priceCents: true,
  priceVisible: true,
  status: true,
  city: true,
  state: true,
  isFeatured: true,
  publishedAt: true,
  createdAt: true,
  mainImage: {
    select: {
      id: true,
      publicUrl: true,
      originalFilename: true,
      width: true,
      height: true,
    },
  },
} satisfies Prisma.ProductSelect;

type PublicProductQueryResult = Prisma.ProductGetPayload<{
  select: typeof publicProductListSelect;
}>;

type CompletePublicProductQueryResult = PublicProductQueryResult & {
  category: NonNullable<PublicProductQueryResult["category"]>;
  subcategory: NonNullable<PublicProductQueryResult["subcategory"]>;
  brand: NonNullable<PublicProductQueryResult["brand"]>;
  model: NonNullable<PublicProductQueryResult["model"]>;
  condition: NonNullable<PublicProductQueryResult["condition"]>;
  city: NonNullable<PublicProductQueryResult["city"]>;
  state: NonNullable<PublicProductQueryResult["state"]>;
  mainImage: NonNullable<PublicProductQueryResult["mainImage"]>;
};

function isCompletePublicProduct(
  product: PublicProductQueryResult,
): product is CompletePublicProductQueryResult {
  return Boolean(
    product.category &&
      product.subcategory &&
      product.brand &&
      product.model &&
      product.condition &&
      product.city &&
      product.state &&
      product.mainImage,
  );
}

function toPublicProductListItem(
  product: CompletePublicProductQueryResult,
): PublicProductListItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    brand: product.brand,
    model: product.model,
    year: product.year,
    condition: product.condition,
    priceCents: product.priceCents,
    priceVisible: product.priceVisible,
    status: product.status,
    city: product.city,
    state: product.state,
    isFeatured: product.isFeatured,
    publishedAt: product.publishedAt,
    createdAt: product.createdAt,
    mainImage: {
      id: product.mainImage.id,
      publicUrl: product.mainImage.publicUrl,
      altText: product.name,
      width: product.mainImage.width,
      height: product.mainImage.height,
    },
  };
}

export async function publicListProducts(): Promise<PublicProductListItem[]> {
  const products = await prisma.product.findMany({
    where: publicProductVisibilityWhere,
    orderBy: [
      {
        isFeatured: "desc",
      },
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
    select: publicProductListSelect,
  });

  return products
    .filter(isCompletePublicProduct)
    .map(toPublicProductListItem);
}
