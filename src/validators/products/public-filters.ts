import {
  ProductCategory,
  ProductCondition,
  ProductStatus,
} from "@prisma/client";

import { normalizeSearchText } from "@/lib/search/normalize";

export type PublicProductFilterParams = {
  q?: string;
  categoria?: ProductCategory;
  condicao?: ProductCondition;
  marca?: string;
  page: number;
  status?: ProductStatus;
};

const categoryByParam: Record<string, ProductCategory> = {
  implementos: ProductCategory.IMPLEMENTOS,
  tratores: ProductCategory.TRATORES,
};

const conditionByParam: Record<string, ProductCondition> = {
  novo: ProductCondition.NOVO,
  seminovo: ProductCondition.SEMINOVO,
  usado: ProductCondition.USADO,
};

const statusByParam: Record<string, ProductStatus> = {
  alugado: ProductStatus.ALUGADO,
  disponivel: ProductStatus.DISPONIVEL,
  sob_consulta: ProductStatus.SOB_CONSULTA,
  vendido: ProductStatus.VENDIDO,
};

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function cleanParam(value: string | string[] | undefined) {
  return firstParam(value)?.trim() || undefined;
}

export function parsePublicProductFilters(
  searchParams: Record<string, string | string[] | undefined>,
): PublicProductFilterParams {
  const q = cleanParam(searchParams.q);
  const marca = cleanParam(searchParams.marca);
  const categoria = cleanParam(searchParams.categoria);
  const condicao = cleanParam(searchParams.condicao);
  const page = Number.parseInt(cleanParam(searchParams.page) ?? "1", 10);
  const status = cleanParam(searchParams.status);

  return {
    q: q ? normalizeSearchText(q) : undefined,
    marca,
    categoria: categoria ? categoryByParam[categoria] : undefined,
    condicao: condicao ? conditionByParam[condicao] : undefined,
    status: status ? statusByParam[status] : undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}
