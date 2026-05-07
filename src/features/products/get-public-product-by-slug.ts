import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

import { publicProductVisibilityWhere } from "./public-list-products";

const publicProductDetailSelect = {
  id: true,
  slug: true,
  name: true,
  category: true,
  subcategory: true,
  brand: true,
  model: true,
  year: true,
  condition: true,
  description: true,
  technicalSpecs: true,
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
  images: {
    orderBy: [
      {
        isMain: "desc",
      },
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
      publicUrl: true,
      originalFilename: true,
      width: true,
      height: true,
      isMain: true,
      sortOrder: true,
    },
  },
} satisfies Prisma.ProductSelect;

type PublicProductDetailQueryResult = Prisma.ProductGetPayload<{
  select: typeof publicProductDetailSelect;
}>;

type CompletePublicProductDetailQueryResult = PublicProductDetailQueryResult & {
  category: NonNullable<PublicProductDetailQueryResult["category"]>;
  subcategory: NonNullable<PublicProductDetailQueryResult["subcategory"]>;
  brand: NonNullable<PublicProductDetailQueryResult["brand"]>;
  model: NonNullable<PublicProductDetailQueryResult["model"]>;
  condition: NonNullable<PublicProductDetailQueryResult["condition"]>;
  description: NonNullable<PublicProductDetailQueryResult["description"]>;
  technicalSpecs: NonNullable<
    PublicProductDetailQueryResult["technicalSpecs"]
  >;
  city: NonNullable<PublicProductDetailQueryResult["city"]>;
  state: NonNullable<PublicProductDetailQueryResult["state"]>;
  mainImage: NonNullable<PublicProductDetailQueryResult["mainImage"]>;
};

export type PublicProductDetailImage = {
  id: string;
  publicUrl: string;
  altText: string;
  width: number | null;
  height: number | null;
  isMain: boolean;
  sortOrder: number;
};

export type PublicProductDetail = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  year: number | null;
  condition: string;
  description: string;
  technicalSpecs: string;
  priceCents: number | null;
  priceVisible: boolean;
  status: string;
  city: string;
  state: string;
  isFeatured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  mainImage: PublicProductDetailImage;
  images: PublicProductDetailImage[];
};

function isCompletePublicProductDetail(
  product: PublicProductDetailQueryResult,
): product is CompletePublicProductDetailQueryResult {
  return Boolean(
    product.category &&
      product.subcategory &&
      product.brand &&
      product.model &&
      product.condition &&
      product.description &&
      product.technicalSpecs &&
      product.city &&
      product.state &&
      product.mainImage,
  );
}

function toPublicProductDetail(
  product: CompletePublicProductDetailQueryResult,
): PublicProductDetail {
  const images = product.images.map((image) => ({
    id: image.id,
    publicUrl: image.publicUrl,
    altText: product.name,
    width: image.width,
    height: image.height,
    isMain: image.isMain,
    sortOrder: image.sortOrder,
  }));

  const mainImage =
    images.find((image) => image.id === product.mainImage.id) ??
    ({
      id: product.mainImage.id,
      publicUrl: product.mainImage.publicUrl,
      altText: product.name,
      width: product.mainImage.width,
      height: product.mainImage.height,
      isMain: true,
      sortOrder: 0,
    } satisfies PublicProductDetailImage);

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
    description: product.description,
    technicalSpecs: product.technicalSpecs,
    priceCents: product.priceCents,
    priceVisible: product.priceVisible,
    status: product.status,
    city: product.city,
    state: product.state,
    isFeatured: product.isFeatured,
    publishedAt: product.publishedAt,
    createdAt: product.createdAt,
    mainImage,
    images,
  };
}

export async function getPublicProductBySlug(
  slug: string,
): Promise<PublicProductDetail | null> {
  const product = await prisma.product.findFirst({
    select: publicProductDetailSelect,
    where: {
      AND: [publicProductVisibilityWhere, { slug }],
    },
  });

  if (!product || !isCompletePublicProductDetail(product)) {
    return null;
  }

  return toPublicProductDetail(product);
}
