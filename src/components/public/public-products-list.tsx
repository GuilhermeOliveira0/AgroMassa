"use client";

import { useState } from "react";

import type { PublicProductListItem } from "@/features/products/public-list-products";

import { ProductCard } from "./product-card";

type SearchParams = Record<string, string | string[] | undefined>;

type SerializedPublicProductListItem = Omit<
  PublicProductListItem,
  "createdAt" | "publishedAt"
> & {
  createdAt: string;
  publishedAt: string | null;
};

type PublicProductsListProps = {
  initialHasMore: boolean;
  initialNextPage: number | null;
  initialProducts: PublicProductListItem[];
  searchParams: SearchParams;
  whatsappPhone: string;
};

type PublicProductsResponse = {
  hasMore: boolean;
  nextPage: number | null;
  products: SerializedPublicProductListItem[];
};

const preservedParams = ["q", "categoria", "condicao", "marca", "status"];

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function buildProductsApiUrl(searchParams: SearchParams, page: number) {
  const params = new URLSearchParams();

  for (const key of preservedParams) {
    const value = firstParam(searchParams[key])?.trim();

    if (value) {
      params.set(key, value);
    }
  }

  params.set("page", String(page));

  return `/api/public/products?${params.toString()}`;
}

function deserializeProduct(
  product: SerializedPublicProductListItem,
): PublicProductListItem {
  return {
    ...product,
    createdAt: new Date(product.createdAt),
    publishedAt: product.publishedAt ? new Date(product.publishedAt) : null,
  };
}

export function PublicProductsList({
  initialHasMore,
  initialNextPage,
  initialProducts,
  searchParams,
  whatsappPhone,
}: PublicProductsListProps) {
  const [products, setProducts] =
    useState<PublicProductListItem[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextPage, setNextPage] = useState(initialNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadMoreProducts() {
    if (!hasMore || !nextPage || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(buildProductsApiUrl(searchParams, nextPage), {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel carregar mais produtos.");
      }

      const data = (await response.json()) as PublicProductsResponse;
      const incomingProducts = data.products.map(deserializeProduct);

      setProducts((currentProducts) => {
        const currentIds = new Set(
          currentProducts.map((product) => product.id),
        );
        const newProducts = incomingProducts.filter(
          (product) => !currentIds.has(product.id),
        );

        return [...currentProducts, ...newProducts];
      });
      setHasMore(data.hasMore);
      setNextPage(data.nextPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Nao foi possivel carregar mais produtos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-agromassa-muted">
          {products.length === 1
            ? "1 produto encontrado"
            : `${products.length} produtos encontrados`}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappPhone={whatsappPhone}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-agromassa-border bg-white px-6 py-12 text-center">
          <p className="text-sm font-black uppercase text-agromassa-green">
            Nenhum produto visivel
          </p>
          <h2 className="mt-3 text-2xl font-black text-agromassa-ink">
            Nenhum produto encontrado.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-agromassa-muted">
            Ajuste os filtros ou limpe a busca para voltar ao catalogo completo
            da AgroMassa.
          </p>
        </div>
      )}

      {errorMessage ? (
        <p className="text-center text-sm font-bold text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {hasMore && nextPage ? (
        <div className="flex justify-center pt-2">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-agromassa-forest px-6 text-sm font-black text-white transition hover:bg-agromassa-ink disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={loadMoreProducts}
            type="button"
          >
            {isLoading ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      ) : null}
    </>
  );
}
