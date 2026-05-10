import Link from "next/link";

import type { AdminProductListItem } from "@/features/products/admin-list-products";
import {
  getProductCategoryLabel,
  getProductConditionLabel,
  getProductStatusLabel,
} from "@/lib/utils/product-display";

type ProductsTableProps = {
  products: AdminProductListItem[];
};

function getAdminProductHref(productId: string) {
  return `/admin/produtos/${productId}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function ProductBadges({ product }: { product: AdminProductListItem }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-md bg-agromassa-ink px-2 py-1 text-[11px] font-black uppercase text-white">
        {getProductStatusLabel(product.status)}
      </span>
      {product.isPublicVisible ? (
        <span className="rounded-md bg-agromassa-green px-2 py-1 text-[11px] font-black uppercase text-white">
          Visivel
        </span>
      ) : (
        <span className="rounded-md bg-agromassa-cream px-2 py-1 text-[11px] font-black uppercase text-agromassa-muted">
          Oculto
        </span>
      )}
      {product.isArchived ? (
        <span className="rounded-md bg-red-50 px-2 py-1 text-[11px] font-black uppercase text-red-700">
          Arquivado
        </span>
      ) : null}
      {product.isFeatured ? (
        <span className="rounded-md bg-agromassa-forest px-2 py-1 text-[11px] font-black uppercase text-white">
          Destaque
        </span>
      ) : null}
    </div>
  );
}

function ProductThumb({ product }: { product: AdminProductListItem }) {
  if (!product.mainImage) {
    return (
      <div className="flex h-14 w-16 items-center justify-center rounded-md border border-dashed border-agromassa-border bg-agromassa-cream text-[11px] font-black uppercase text-agromassa-muted">
        Sem foto
      </div>
    );
  }

  return (
    <div
      aria-label={product.name}
      className="h-14 w-16 rounded-md bg-agromassa-ink bg-cover bg-center"
      role="img"
      style={{
        backgroundImage: `url("${product.mainImage.publicUrl.replaceAll('"', '\\"')}"), url("/brand/agromassa1.jpeg")`,
      }}
    />
  );
}

function ProductActions({ product }: { product: AdminProductListItem }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className="inline-flex min-h-9 items-center justify-center rounded-md border border-agromassa-border px-3 text-xs font-black text-agromassa-forest transition hover:border-agromassa-forest"
        href={getAdminProductHref(product.id)}
      >
        Abrir
      </Link>
    </div>
  );
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-agromassa-border bg-white">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-agromassa-cream text-xs font-black uppercase text-agromassa-muted">
            <tr>
              <th className="px-5 py-4">Produto</th>
              <th className="px-5 py-4">Categoria</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Datas</th>
              <th className="px-5 py-4">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-agromassa-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-4">
                  <Link
                    className="flex items-center gap-3 rounded-md outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-agromassa-green"
                    href={getAdminProductHref(product.id)}
                  >
                    <ProductThumb product={product} />
                    <div className="min-w-0">
                      <p className="font-black text-agromassa-ink">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs font-bold text-agromassa-muted">
                        {[product.brand, product.model]
                          .filter(Boolean)
                          .join(" / ") || "Marca e modelo nao informados"}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <p className="font-black text-agromassa-ink">
                    {getProductCategoryLabel(product.category)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-agromassa-muted">
                    {getProductConditionLabel(product.condition)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <ProductBadges product={product} />
                </td>
                <td className="px-5 py-4 text-xs font-bold text-agromassa-muted">
                  <p>Criado em {formatDate(product.createdAt)}</p>
                  <p className="mt-1">Atualizado em {formatDate(product.updatedAt)}</p>
                </td>
                <td className="px-5 py-4">
                  <ProductActions product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid divide-y divide-agromassa-border lg:hidden">
        {products.map((product) => (
          <article className="p-4" key={product.id}>
            <Link
              className="flex gap-3 rounded-md outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-agromassa-green"
              href={getAdminProductHref(product.id)}
            >
              <ProductThumb product={product} />
              <div className="min-w-0 flex-1">
                <h2 className="font-black leading-tight text-agromassa-ink">
                  {product.name}
                </h2>
                <p className="mt-1 text-xs font-bold text-agromassa-muted">
                  {[product.brand, product.model].filter(Boolean).join(" / ") ||
                    "Marca e modelo nao informados"}
                </p>
              </div>
            </Link>

            <div className="mt-4">
              <ProductBadges product={product} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="font-black uppercase text-agromassa-muted">
                  Categoria
                </dt>
                <dd className="mt-1 font-bold text-agromassa-ink">
                  {getProductCategoryLabel(product.category)}
                </dd>
              </div>
              <div>
                <dt className="font-black uppercase text-agromassa-muted">
                  Condicao
                </dt>
                <dd className="mt-1 font-bold text-agromassa-ink">
                  {getProductConditionLabel(product.condition)}
                </dd>
              </div>
              <div>
                <dt className="font-black uppercase text-agromassa-muted">
                  Criado
                </dt>
                <dd className="mt-1 font-bold text-agromassa-ink">
                  {formatDate(product.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="font-black uppercase text-agromassa-muted">
                  Atualizado
                </dt>
                <dd className="mt-1 font-bold text-agromassa-ink">
                  {formatDate(product.updatedAt)}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <ProductActions product={product} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
