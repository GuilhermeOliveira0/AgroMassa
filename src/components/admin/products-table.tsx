"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useToast } from "@/components/ui/toast-provider";
import { ProductCardImage } from "@/components/public/product-card-image";
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
  actionState: ProductQuickActionState;
  onActionStateChange: (state: ProductQuickActionState) => void;
  product: AdminProductListItem;
};

type ProductQuickActionState = Pick<
  AdminProductListItem,
  "isArchived" | "isFeatured" | "isPublicVisible" | "status"
>;

type ProductQuickActionType = AdminQuickProductActionInput["type"];

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

function getProductQuickActionState(
  product: AdminProductListItem,
): ProductQuickActionState {
  return {
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    isPublicVisible: product.isPublicVisible,
    status: product.status,
  };
}

function buildProductStateMap(products: AdminProductListItem[]) {
  return Object.fromEntries(
    products.map((product) => [product.id, getProductQuickActionState(product)]),
  );
}

function ProductBadges({
  actionState,
}: {
  actionState: ProductQuickActionState;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-md bg-agromassa-ink px-2 py-1 text-[11px] font-black uppercase text-white">
        {getProductStatusLabel(actionState.status)}
      </span>
      {actionState.isPublicVisible ? (
        <span className="rounded-md bg-agromassa-green px-2 py-1 text-[11px] font-black uppercase text-white">
          Visivel
        </span>
      ) : (
        <span className="rounded-md bg-agromassa-cream px-2 py-1 text-[11px] font-black uppercase text-agromassa-muted">
          Oculto
        </span>
      )}
      {actionState.isArchived ? (
        <span className="rounded-md bg-red-50 px-2 py-1 text-[11px] font-black uppercase text-red-700">
          Arquivado
        </span>
      ) : null}
      {actionState.isFeatured ? (
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
    <div className="h-14 w-16 overflow-hidden rounded-md bg-agromassa-ink">
      <ProductCardImage
        alt={product.name}
        sizes="64px"
        src={product.mainImage.publicUrl}
      />
    </div>
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
  actionState,
  onActionStateChange,
  product,
}: ProductQuickActionControlsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] =
    useState<ProductQuickActionType | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const isActionPending = isPending || pendingAction !== null;
  const canPromoteDraft =
    product.canBePublished || actionState.status !== "RASCUNHO";
  const canToggleVisibility = !actionState.isArchived && product.canBePublished;

  function showQuickActionError(message?: string) {
    showToast({
      message: message ?? "Nao foi possivel concluir a acao. Tente novamente.",
      tone: "validation",
    });
  }

  function runQuickAction(
    input: AdminQuickProductActionInput,
    rollback: () => void,
    options: {
      refreshAfterSuccess?: boolean;
    } = {},
  ) {
    if (pendingAction) {
      return;
    }

    setPendingAction(input.type);

    startTransition(async () => {
      try {
        const result = await updateProductQuickActionAction(input);

        if (!result.ok) {
          rollback();
          showQuickActionError(result.formError);
          return;
        }

        showToast({
          message: getQuickActionSuccessMessage(input),
          tone: "success",
        });

        if (options.refreshAfterSuccess) {
          router.refresh();
        }
      } catch {
        rollback();
        showQuickActionError();
      } finally {
        setPendingAction(null);
      }
    });
  }

  function handleStatusChange(nextStatus: string) {
    if (pendingAction) {
      return;
    }

    const previousState = actionState;
    const nextState = {
      ...actionState,
      isPublicVisible:
        nextStatus === "RASCUNHO" ? false : actionState.isPublicVisible,
      status: nextStatus,
    };
    onActionStateChange(nextState);

    runQuickAction(
      {
        productId: product.id,
        status: nextStatus as (typeof ADMIN_PRODUCT_STATUS_VALUES)[number],
        type: "status",
      },
      () => {
        onActionStateChange(previousState);
      },
    );
  }

  function handleVisibilityToggle() {
    if (pendingAction) {
      return;
    }

    const previousState = actionState;
    const nextState = {
      ...actionState,
      isPublicVisible: !actionState.isPublicVisible,
    };
    onActionStateChange(nextState);

    runQuickAction(
      {
        isPublicVisible: nextState.isPublicVisible,
        productId: product.id,
        type: "visibility",
      },
      () => {
        onActionStateChange(previousState);
      },
    );
  }

  function handleFeaturedToggle() {
    if (pendingAction) {
      return;
    }

    const previousState = actionState;
    const nextState = {
      ...actionState,
      isFeatured: !actionState.isFeatured,
    };
    onActionStateChange(nextState);

    runQuickAction(
      {
        isFeatured: nextState.isFeatured,
        productId: product.id,
        type: "featured",
      },
      () => {
        onActionStateChange(previousState);
      },
    );
  }

  function handleArchiveToggle() {
    if (pendingAction) {
      return;
    }

    const previousState = actionState;
    const nextState = {
      ...actionState,
      isArchived: !actionState.isArchived,
      isPublicVisible: !actionState.isArchived
        ? false
        : actionState.isPublicVisible,
    };
    setIsConfirmDialogOpen(false);
    onActionStateChange(nextState);

    runQuickAction(
      {
        isArchived: nextState.isArchived,
        productId: product.id,
        type: "archive",
      },
      () => {
        onActionStateChange(previousState);
      },
      {
        refreshAfterSuccess: true,
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
            disabled={isActionPending}
            onChange={(event) => handleStatusChange(event.target.value)}
            value={actionState.status}
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
          {pendingAction === "status" ? (
            <span className="text-[11px] font-bold text-agromassa-muted">
              Salvando status...
            </span>
          ) : null}
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            className="inline-flex min-h-9 items-center justify-center rounded-md border border-agromassa-border px-3 text-xs font-black text-agromassa-forest transition hover:border-agromassa-forest disabled:cursor-not-allowed disabled:bg-agromassa-cream disabled:text-agromassa-muted"
            disabled={isActionPending || !canToggleVisibility}
            onClick={handleVisibilityToggle}
            type="button"
          >
            {pendingAction === "visibility"
              ? "Salvando..."
              : actionState.isPublicVisible
                ? "Ocultar no site"
                : "Exibir no site"}
          </button>
          <button
            className="inline-flex min-h-9 items-center justify-center rounded-md border border-agromassa-border px-3 text-xs font-black text-agromassa-forest transition hover:border-agromassa-forest disabled:cursor-not-allowed disabled:bg-agromassa-cream disabled:text-agromassa-muted"
            disabled={isActionPending}
            onClick={handleFeaturedToggle}
            type="button"
          >
            {pendingAction === "featured"
              ? "Salvando..."
              : actionState.isFeatured
                ? "Remover destaque"
                : "Marcar destaque"}
          </button>
        </div>

        <button
          className={`inline-flex min-h-9 items-center justify-center rounded-md px-3 text-xs font-black transition ${
            actionState.isArchived
              ? "border border-agromassa-border bg-white text-agromassa-forest hover:border-agromassa-forest"
              : "border border-red-200 bg-white text-red-700 hover:border-red-600"
          }`}
          disabled={isActionPending}
          onClick={() => setIsConfirmDialogOpen(true)}
          type="button"
        >
          {pendingAction === "archive"
            ? "Salvando..."
            : actionState.isArchived
              ? "Restaurar produto"
              : "Arquivar produto"}
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
              {actionState.isArchived ? "Restaurar produto?" : "Arquivar produto?"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-agromassa-muted">
              {actionState.isArchived
                ? "O produto voltara para a base ativa, mas permanecera oculto no site ate que voce ajuste a visibilidade."
                : "O produto sera arquivado e deixara de ficar visivel no site ate que seja restaurado."}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
                disabled={isActionPending}
                onClick={() => setIsConfirmDialogOpen(false)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-black text-white transition ${
                  actionState.isArchived
                    ? "bg-agromassa-forest hover:bg-agromassa-ink"
                    : "bg-red-700 hover:bg-red-800"
                }`}
                disabled={isActionPending}
                onClick={handleArchiveToggle}
                type="button"
              >
                {pendingAction === "archive"
                  ? "Salvando..."
                  : actionState.isArchived
                    ? "Confirmar restauracao"
                    : "Confirmar arquivamento"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [productStates, setProductStates] = useState(() =>
    buildProductStateMap(products),
  );

  function setProductActionState(
    productId: string,
    state: ProductQuickActionState,
  ) {
    setProductStates((currentStates) => ({
      ...currentStates,
      [productId]: state,
    }));
  }

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
                  <ProductBadges
                    actionState={
                      productStates[product.id] ??
                      getProductQuickActionState(product)
                    }
                  />
                </td>
                <td className="px-5 py-4 align-top text-xs font-bold text-agromassa-muted">
                  <p>Criado em {formatDate(product.createdAt)}</p>
                  <p className="mt-1">Atualizado em {formatDate(product.updatedAt)}</p>
                </td>
                <td className="px-5 py-4 align-top">
                  <ProductQuickActionControls
                    key={`${product.id}-${product.updatedAt.toISOString()}`}
                    actionState={
                      productStates[product.id] ??
                      getProductQuickActionState(product)
                    }
                    onActionStateChange={(state) =>
                      setProductActionState(product.id, state)
                    }
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
              <ProductBadges
                actionState={
                  productStates[product.id] ?? getProductQuickActionState(product)
                }
              />
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
                actionState={
                  productStates[product.id] ?? getProductQuickActionState(product)
                }
                onActionStateChange={(state) =>
                  setProductActionState(product.id, state)
                }
                product={product}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
