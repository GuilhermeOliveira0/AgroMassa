import { ProductStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { normalizeSearchText } from "@/lib/search/normalize";
import { getProductImageDisplayUrl } from "@/lib/storage/supabase-storage";
import type { PublicProductFilterParams } from "@/validators/products/public-filters";

export const PUBLIC_PRODUCTS_PAGE_SIZE = 9;

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
      storageKey: true,
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

async function toPublicProductListItem(
  product: CompletePublicProductQueryResult,
): Promise<PublicProductListItem> {
  const mainImageUrl = await getProductImageDisplayUrl({
    publicUrl: product.mainImage.publicUrl,
    storageKey: product.mainImage.storageKey,
  });

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
      publicUrl: mainImageUrl,
      altText: product.name,
      width: product.mainImage.width,
      height: product.mainImage.height,
    },
  };
}

function buildPublicProductWhere(
  filters: PublicProductFilterParams,
): Prisma.ProductWhereInput {
  const searchFilters: Prisma.ProductWhereInput[] = [];

  if (filters.q) {
    searchFilters.push({
      searchTextNormalized: {
        contains: filters.q,
      },
    });
  }

  if (filters.marca) {
    searchFilters.push({
      brand: {
        contains: filters.marca,
        mode: "insensitive",
      },
    });
  }

  return {
    AND: [
      publicProductVisibilityWhere,
      filters.categoria ? { category: filters.categoria } : {},
      filters.condicao ? { condition: filters.condicao } : {},
      filters.status ? { status: filters.status } : {},
      ...searchFilters,
    ],
  };
}

export async function publicListProducts(
  filters: PublicProductFilterParams = { page: 1 },
): Promise<PublicProductListItem[]> {
  const products = await prisma.product.findMany({
    where: buildPublicProductWhere(filters),
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

  return Promise.all(
    products.filter(isCompletePublicProduct).map(toPublicProductListItem),
  );
}

export type PublicProductListPage = {
  hasMore: boolean;
  nextPage: number | null;
  page: number;
  pageSize: number;
  products: PublicProductListItem[];
};

export async function publicListProductsPage(
  filters: PublicProductFilterParams,
  pageSize = PUBLIC_PRODUCTS_PAGE_SIZE,
): Promise<PublicProductListPage> {
  const page = Math.max(filters.page, 1);
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
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
    skip,
    take: pageSize + 1,
    where: buildPublicProductWhere(filters),
  });

  const pageProducts = products.slice(0, pageSize);
  const visibleProducts = await Promise.all(
    pageProducts.filter(isCompletePublicProduct).map(toPublicProductListItem),
  );
  const hasMore = products.length > pageSize;

  return {
    hasMore,
    nextPage: hasMore ? page + 1 : null,
    page,
    pageSize,
    products: visibleProducts,
  };
}

export async function publicListProductBrands(): Promise<string[]> {
  const products = await prisma.product.findMany({
    distinct: ["brand"],
    orderBy: {
      brand: "asc",
    },
    select: {
      brand: true,
    },
    where: publicProductVisibilityWhere,
  });

  return products
    .map((product) => product.brand)
    .filter((brand): brand is string => Boolean(brand))
    .filter(
      (brand, index, brands) =>
        brands.findIndex(
          (item) => normalizeSearchText(item) === normalizeSearchText(brand),
        ) === index,
    );
}
