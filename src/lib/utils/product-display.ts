export const PRODUCT_CATEGORY_LABELS = {
  IMPLEMENTOS: "Implementos",
  TRATORES: "Tratores",
} as const;

export const PRODUCT_CONDITION_LABELS = {
  NOVO: "Novo",
  SEMINOVO: "Seminovo",
  USADO: "Usado",
} as const;

export const PRODUCT_STATUS_LABELS = {
  ALUGADO: "Alugado",
  DISPONIVEL: "Disponivel",
  RASCUNHO: "Rascunho",
  SOB_CONSULTA: "Sob consulta",
  VENDIDO: "Vendido",
} as const;

type ProductPrice = {
  priceCents: number | null;
  priceVisible: boolean;
};

function labelFromMap(
  labels: Record<string, string>,
  value: string | null | undefined,
  emptyLabel = "Nao informado",
) {
  if (!value) {
    return emptyLabel;
  }

  return labels[value] ?? value;
}

export function getProductCategoryLabel(value: string | null | undefined) {
  return labelFromMap(PRODUCT_CATEGORY_LABELS, value);
}

export function getProductConditionLabel(value: string | null | undefined) {
  return labelFromMap(PRODUCT_CONDITION_LABELS, value);
}

export function getProductStatusLabel(value: string | null | undefined) {
  return labelFromMap(PRODUCT_STATUS_LABELS, value);
}

export function formatProductPrice(product: ProductPrice) {
  if (!product.priceVisible || product.priceCents === null) {
    return "Sob consulta";
  }

  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(product.priceCents / 100);
}
