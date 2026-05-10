import type { PublicProductDetail } from "@/features/products/get-public-product-by-slug";
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductConditionLabel,
  getProductStatusLabel,
} from "@/lib/utils/product-display";
import {
  buildProductWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";

type ProductDetailProps = {
  product: PublicProductDetail;
  whatsappPhone: string;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  if (value === null || value === "") {
    return null;
  }

  return (
    <div className="rounded-lg border border-agromassa-border bg-white p-4">
      <dt className="text-xs font-black uppercase text-agromassa-muted">
        {label}
      </dt>
      <dd className="mt-1 text-base font-black text-agromassa-ink">{value}</dd>
    </div>
  );
}

export function ProductDetail({ product, whatsappPhone }: ProductDetailProps) {
  const priceLabel = formatProductPrice(product);
  const whatsappUrl = buildWhatsAppUrl({
    message: buildProductWhatsAppMessage({
      productName: product.name,
    }),
    phone: whatsappPhone,
  });

  return (
    <section className="grid gap-6">
      <div className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-agromassa-cream px-3 py-1 text-xs font-black uppercase text-agromassa-forest">
            {getProductCategoryLabel(product.category)}
          </span>
          <span className="rounded-md bg-agromassa-ink px-3 py-1 text-xs font-black uppercase text-white">
            {getProductStatusLabel(product.status)}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black leading-tight text-agromassa-ink sm:text-4xl">
          {product.name}
        </h1>

        <p className="mt-3 text-base leading-7 text-agromassa-muted">
          {product.description}
        </p>

        <div className="mt-6 border-t border-agromassa-border pt-5">
          <p className="text-xs font-black uppercase text-agromassa-muted">
            Preco
          </p>
          <p className="mt-1 text-3xl font-black text-agromassa-forest">
            {priceLabel}
          </p>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <DetailItem label="Marca" value={product.brand} />
        <DetailItem label="Modelo" value={product.model} />
        <DetailItem
          label="Condicao"
          value={getProductConditionLabel(product.condition)}
        />
        <DetailItem label="Ano" value={product.year} />
        <DetailItem label="Categoria" value={product.subcategory} />
        <DetailItem label="Local" value={`${product.city}, ${product.state}`} />
      </dl>

      <div className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">
          Dados tecnicos
        </h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-agromassa-muted">
          {product.technicalSpecs}
        </p>
      </div>

      <div className="rounded-lg border border-agromassa-border bg-agromassa-ink p-5 text-white sm:p-6">
        <p className="text-xs font-black uppercase text-agromassa-green">
          Atendimento AgroMassa
        </p>
        <p className="mt-2 text-sm leading-6 text-white/75">
          Entre em contato com a equipe para confirmar disponibilidade,
          negociacao e condicoes comerciais deste produto.
        </p>
        {whatsappUrl ? (
          <a
            aria-label={`Chamar no WhatsApp sobre ${product.name}`}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-agromassa-green px-5 text-sm font-black text-white transition hover:bg-[#2f9714]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            Chamar no WhatsApp
          </a>
        ) : null}
      </div>
    </section>
  );
}
