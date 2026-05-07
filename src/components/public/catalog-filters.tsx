import Link from "next/link";

import type { PublicProductFilterParams } from "@/validators/products/public-filters";

type CatalogFiltersProps = {
  brands: string[];
  filters: PublicProductFilterParams;
};

const categoryOptions = [
  { label: "Tratores", value: "tratores" },
  { label: "Implementos", value: "implementos" },
];

const conditionOptions = [
  { label: "Novo", value: "novo" },
  { label: "Seminovo", value: "seminovo" },
  { label: "Usado", value: "usado" },
];

const statusOptions = [
  { label: "Disponivel", value: "disponivel" },
  { label: "Sob consulta", value: "sob_consulta" },
  { label: "Vendido", value: "vendido" },
  { label: "Alugado", value: "alugado" },
];

const categoryParamByValue: Record<string, string> = {
  IMPLEMENTOS: "implementos",
  TRATORES: "tratores",
};

const conditionParamByValue: Record<string, string> = {
  NOVO: "novo",
  SEMINOVO: "seminovo",
  USADO: "usado",
};

const statusParamByValue: Record<string, string> = {
  ALUGADO: "alugado",
  DISPONIVEL: "disponivel",
  SOB_CONSULTA: "sob_consulta",
  VENDIDO: "vendido",
};

export function CatalogFilters({ brands, filters }: CatalogFiltersProps) {
  return (
    <form
      action="/produtos"
      className="rounded-lg border border-agromassa-border bg-white p-4"
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
        <label className="grid gap-1.5">
          <span className="text-xs font-black uppercase text-agromassa-muted">
            Buscar
          </span>
          <input
            className="min-h-11 rounded-md border border-agromassa-border bg-white px-3 text-sm font-semibold text-agromassa-ink outline-none transition focus:border-agromassa-green"
            defaultValue={filters.q ?? ""}
            name="q"
            placeholder="Nome, marca ou modelo"
            type="search"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-black uppercase text-agromassa-muted">
            Categoria
          </span>
          <select
            className="min-h-11 rounded-md border border-agromassa-border bg-white px-3 text-sm font-semibold text-agromassa-ink outline-none transition focus:border-agromassa-green"
            defaultValue={
              filters.categoria ? categoryParamByValue[filters.categoria] : ""
            }
            name="categoria"
          >
            <option value="">Todas</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-black uppercase text-agromassa-muted">
            Condicao
          </span>
          <select
            className="min-h-11 rounded-md border border-agromassa-border bg-white px-3 text-sm font-semibold text-agromassa-ink outline-none transition focus:border-agromassa-green"
            defaultValue={
              filters.condicao ? conditionParamByValue[filters.condicao] : ""
            }
            name="condicao"
          >
            <option value="">Todas</option>
            {conditionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-black uppercase text-agromassa-muted">
            Marca
          </span>
          <select
            className="min-h-11 rounded-md border border-agromassa-border bg-white px-3 text-sm font-semibold text-agromassa-ink outline-none transition focus:border-agromassa-green"
            defaultValue={filters.marca ?? ""}
            name="marca"
          >
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-black uppercase text-agromassa-muted">
            Status
          </span>
          <select
            className="min-h-11 rounded-md border border-agromassa-border bg-white px-3 text-sm font-semibold text-agromassa-ink outline-none transition focus:border-agromassa-green"
            defaultValue={
              filters.status ? statusParamByValue[filters.status] : ""
            }
            name="status"
          >
            <option value="">Todos</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button
            className="min-h-11 rounded-md bg-agromassa-forest px-5 text-sm font-black text-white transition hover:bg-agromassa-ink"
            type="submit"
          >
            Filtrar
          </button>
          <Link
            className="inline-flex min-h-11 items-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
            href="/produtos"
          >
            Limpar
          </Link>
        </div>
      </div>
    </form>
  );
}
