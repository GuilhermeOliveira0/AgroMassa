import Link from "next/link";

type AdminPaginationProps = {
  page: number;
  pageSize: number;
  searchParams: Record<string, string | string[] | undefined>;
  total: number;
  totalPages: number;
};

function appendSearchParam(
  params: URLSearchParams,
  key: string,
  value: string | string[] | undefined,
) {
  if (key === "page") {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const trimmedItem = item.trim();

      if (trimmedItem) {
        params.append(key, trimmedItem);
      }
    }

    return;
  }

  const trimmedValue = value?.trim();

  if (trimmedValue) {
    params.set(key, trimmedValue);
  }
}

function buildPageHref(
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    appendSearchParam(params, key, value);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/admin/produtos?${query}` : "/admin/produtos";
}

function PaginationDisabledButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border bg-agromassa-cream px-4 text-sm font-black text-agromassa-muted">
      {children}
    </span>
  );
}

function PaginationLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border bg-white px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
      href={href}
    >
      {children}
    </Link>
  );
}

export function AdminPagination({
  page,
  pageSize,
  searchParams,
  total,
  totalPages,
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return (
    <nav
      aria-label="Paginacao de produtos administrativos"
      className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-agromassa-border bg-white p-3"
    >
      <p className="text-sm font-bold text-agromassa-muted">
        Exibindo {firstItem}-{lastItem} de {total}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {hasPreviousPage ? (
          <PaginationLink href={buildPageHref(searchParams, page - 1)}>
            Anterior
          </PaginationLink>
        ) : (
          <PaginationDisabledButton>Anterior</PaginationDisabledButton>
        )}

        <span className="inline-flex min-h-10 items-center justify-center px-2 text-sm font-black text-agromassa-ink">
          Pagina {page} de {totalPages}
        </span>

        {hasNextPage ? (
          <PaginationLink href={buildPageHref(searchParams, page + 1)}>
            Proxima
          </PaginationLink>
        ) : (
          <PaginationDisabledButton>Proxima</PaginationDisabledButton>
        )}
      </div>
    </nav>
  );
}
