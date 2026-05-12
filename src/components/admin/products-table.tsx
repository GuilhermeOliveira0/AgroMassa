"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useToast } from "@/components/ui/toast-provider";
import type { AdminProductListItem } from "@/features/products/admin-list-products";
import { updateProductQuickActionAction } from "@/features/products/admin-product-actions";
import {
  getProductCategoryLabel,
  getProductConditionLabel,
  getProductStatusLabel,
} from "@/lib/utils/product-display";
import { ADMIN_PRODUCT_STATUS_VALUES } from "@/validators/products/admin-product";
import type { AdminQuickProductActionInput } from "@/validators/products/admin-quick-action";

type ProductsTableProps = {
  products: AdminProductListItem[];
};

type ProductQuickActionControlsProps = {
  product: AdminProductListItem;
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

function getQuickActionSuccessMessage(input: AdminQuickProductActionInput) {
  switch (input.type) {
    case "status":
      return `Status alterado para ${getProductStatusLabel(input.status)}.`;
    case "visibility":
      return input.isPublicVisible
        ? "Produto visivel no site."
        : "Produto ocultado do site.";
    case "featured":
      return input.isFeatured
        ? "Produto marcado como destaque."
        : "Destaque removido do produto.";
    case "archive":
      return input.isArchived
        ? "Produto arquivado com sucesso."
        : "Produto restaurado com sucesso.";
  }
}

function ProductQuickActionControls({
  product,
}: ProductQuickActionControlsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(product.status);
  const [isPublicVisible, setIsPublicVisible] = useState(product.isPublicVisible);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);
  const [isArchived, setIsArchived] = useState(product.isArchived);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const canPromoteDraft = product.canBePublished || status !== "RASCUNHO";
  const canToggleVisibility = !isArchived && product.canBePublished;

  function runQuickAction(
    input: AdminQuickProductActionInput,
    rollback: () => void,
    applySuccessState?: () => void,
  ) {
    startTransition(async () => {
      const result = await updateProductQuickActionAction(input);

      if (!result.ok) {
        rollback();
        showToast({
          message:
            result.formError ?? "Nao foi possivel concluir a acao. Tente novamente.",
          tone: "validation",
        });
        return;
      }

      applySuccessState?.();
      showToast({
        message: getQuickActionSuccessMessage(input),
        tone: "success",
      });
      router.refresh();
    });
  }

  function handleStatusChange(nextStatus: string) {
    const previousStatus = status;
    const previousVisibility = isPublicVisible;

    setStatus(nextStatus);

    if (nextStatus === "RASCUNHO") {
      setIsPublicVisible(false);
    }

    runQuickAction(
      {
        productId: product.id,
        status: nextStatus as (typeof ADMIN_PRODUCT_STATUS_VALUES)[number],
        type: "status",
      },
      () => {
        setStatus(previousStatus);
        setIsPublicVisible(previousVisibility);
      },
    );
  }

  function handleVisibilityToggle() {
    const previousValue = isPublicVisible;
    const nextValue = !previousValue;

    setIsPublicVisible(nextValue);

    runQuickAction(
      {
        isPublicVisible: nextValue,
        productId: product.id,
        type: "visibility",
      },
      () => {
        setIsPublicVisible(previousValue);
      },
    );
  }

  function handleFeaturedToggle() {
    const previousValue = isFeatured;
    const nextValue = !previousValue;

    setIsFeatured(nextValue);

    runQuickAction(
      {
        isFeatured: nextValue,
        productId: product.id,
        type: "featured",
      },
      () => {
        setIsFeatured(previousValue);
      },
    );
  }

  function handleArchiveToggle() {
    const previousArchived = isArchived;
    const previousVisibility = isPublicVisible;
    const nextArchived = !previousArchived;

    setIsConfirmDialogOpen(false);
    setIsArchived(nextArchived);

    if (nextArchived) {
      setIsPublicVisible(false);
    }

    runQuickAction(
      {
        isArchived: nextArchived,
        productId: product.id,
        type: "archive",
      },
      () => {
        setIsArchived(previousArchived);
        setIsPublicVisible(previousVisibility);
      },
    );
  }

  return (
    <>
      <div className="grid gap-2">
        <Link
          className="inline-flex min-h-9 items-center justify-center rounded-md border border-agromassa-border px-3 text-xs font-black text-agromassa-forest transition hover:border-agromassa-forest"
          href={getAdminProductHref(product.id)}
        >
          Abrir
        </Link>

        <label className="grid gap-1">
          <span className="text-[11px] font-black uppercase text-agromassa-muted">
            Status
          </span>
          <select
            className="min-h-9 rounded-md border border-agromassa-border bg-white px-3 text-xs font-black text-agromassa-ink outline-none transition focus:border-agromassa-forest disabled:cursor-not-allowed disabled:bg-agromassa-cream"
            disabled={isPending}
            onChange={(event) => handleStatusChange(event.target.value)}
            value={status}
          >
            {ADMIN_PRODUCT_STATUS_VALUES.map((statusValue) => (
              <option
                disabled={statusValue !== "RASCUNHO" && !canPromoteDraft}
                key={statusValue}
                value={statusValue}
              >
                {getProductStatusLabel(statusValue)}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            className="inline-flex min-h-9 items-center justify-center rounded-md border border-agromassa-border px-3 text-xs font-black text-agromassa-forest transition hover:border-agromassa-forest disabled:cursor-not-allowed disabled:bg-agromassa-cream disabled:text-agromassa-muted"
            disabled={isPending || !canToggleVisibility}
            onClick={handleVisibilityToggle}
            type="button"
          >
            {isPublicVisible ? "Ocultar no site" : "Exibir no site"}
          </button>
          <button
            className="inline-flex min-h-9 items-center justify-center rounded-md border border-agromassa-border px-3 text-xs font-black text-agromassa-forest transition hover:border-agromassa-forest disabled:cursor-not-allowed disabled:bg-agromassa-cream disabled:text-agromassa-muted"
            disabled={isPending}
            onClick={handleFeaturedToggle}
            type="button"
          >
            {isFeatured ? "Remover destaque" : "Marcar destaque"}
          </button>
        </div>

        <button
          className={`inline-flex min-h-9 items-center justify-center rounded-md px-3 text-xs font-black transition ${
            isArchived
              ? "border border-agromassa-border bg-white text-agromassa-forest hover:border-agromassa-forest"
              : "border border-red-200 bg-white text-red-700 hover:border-red-600"
          }`}
          disabled={isPending}
          onClick={() => setIsConfirmDialogOpen(true)}
          type="button"
        >
          {isArchived ? "Restaurar produto" : "Arquivar produto"}
        </button>

        {product.publicationBlockReason ? (
          <p className="text-[11px] font-bold leading-5 text-agromassa-muted">
            {product.publicationBlockReason}
          </p>
        ) : null}
      </div>

      {isConfirmDialogOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-lg border border-agromassa-border bg-white p-5 shadow-xl">
            <p className="text-sm font-black uppercase text-agromassa-green">
              Confirmacao
            </p>
            <h3 className="mt-2 text-2xl font-black text-agromassa-ink">
              {isArchived ? "Restaurar produto?" : "Arquivar produto?"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-agromassa-muted">
              {isArchived
                ? "O produto voltara para a base ativa, mas permanecera oculto no site ate que voce ajuste a visibilidade."
                : "O produto sera arquivado e deixara de ficar visivel no site ate que seja restaurado."}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
                disabled={isPending}
                onClick={() => setIsConfirmDialogOpen(false)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-black text-white transition ${
                  isArchived
                    ? "bg-agromassa-forest hover:bg-agromassa-ink"
                    : "bg-red-700 hover:bg-red-800"
                }`}
                disabled={isPending}
                onClick={handleArchiveToggle}
                type="button"
              >
                {isArchived ? "Confirmar restauracao" : "Confirmar arquivamento"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
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
                <td className="px-5 py-4 align-top">
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
                <td className="px-5 py-4 align-top">
                  <p className="font-black text-agromassa-ink">
                    {getProductCategoryLabel(product.category)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-agromassa-muted">
                    {getProductConditionLabel(product.condition)}
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  <ProductBadges product={product} />
                </td>
                <td className="px-5 py-4 align-top text-xs font-bold text-agromassa-muted">
                  <p>Criado em {formatDate(product.createdAt)}</p>
                  <p className="mt-1">Atualizado em {formatDate(product.updatedAt)}</p>
                </td>
                <td className="px-5 py-4 align-top">
                  <ProductQuickActionControls
                    key={`${product.id}-${product.updatedAt.toISOString()}`}
                    product={product}
                  />
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
              <ProductQuickActionControls
                key={`${product.id}-${product.updatedAt.toISOString()}`}
                product={product}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
