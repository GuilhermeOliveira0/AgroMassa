import Link from "next/link";

type LoadMoreButtonProps = {
  nextPage: number;
  searchParams: Record<string, string | string[] | undefined>;
};

const preservedParams = ["q", "categoria", "condicao", "marca", "status"];

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function buildNextPageHref(
  searchParams: Record<string, string | string[] | undefined>,
  nextPage: number,
) {
  const params = new URLSearchParams();

  for (const key of preservedParams) {
    const value = firstParam(searchParams[key])?.trim();

    if (value) {
      params.set(key, value);
    }
  }

  params.set("page", String(nextPage));

  return `/produtos?${params.toString()}`;
}

export function LoadMoreButton({
  nextPage,
  searchParams,
}: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center pt-2">
      <Link
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-agromassa-forest px-6 text-sm font-black text-white transition hover:bg-agromassa-ink"
        href={buildNextPageHref(searchParams, nextPage)}
      >
        Carregar mais
      </Link>
    </div>
  );
}
