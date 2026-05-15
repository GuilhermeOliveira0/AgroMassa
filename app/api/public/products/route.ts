import { NextResponse } from "next/server";

import { publicListProductsPage } from "@/features/products/public-list-products";
import { parsePublicProductFilters } from "@/validators/products/public-filters";

type PublicProductsSearchParams = Record<string, string | string[] | undefined>;

function toSearchParamsRecord(searchParams: URLSearchParams) {
  const params: PublicProductsSearchParams = {};

  for (const [key, value] of searchParams.entries()) {
    const currentValue = params[key];

    if (Array.isArray(currentValue)) {
      currentValue.push(value);
    } else if (currentValue) {
      params[key] = [currentValue, value];
    } else {
      params[key] = value;
    }
  }

  return params;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = parsePublicProductFilters(
    toSearchParamsRecord(url.searchParams),
  );
  const productPage = await publicListProductsPage(filters);

  return NextResponse.json({
    hasMore: productPage.hasMore,
    nextPage: productPage.nextPage,
    page: productPage.page,
    pageSize: productPage.pageSize,
    products: productPage.products.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      publishedAt: product.publishedAt?.toISOString() ?? null,
    })),
  });
}
