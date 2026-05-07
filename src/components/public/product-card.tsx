import Link from "next/link";

import type { PublicProductListItem } from "@/features/products/public-list-products";
import {
  buildProductWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";

import { ProductCardImage } from "./product-card-image";

type ProductCardProps = {
  product: PublicProductListItem;
  whatsappPhone: string;
};

const categoryLabels: Record<string, string> = {
  TRATORES: "Tratores",
  IMPLEMENTOS: "Implementos",
};

const conditionLabels: Record<string, string> = {
  NOVO: "Novo",
  USADO: "Usado",
  SEMINOVO: "Seminovo",
};

const statusLabels: Record<string, string> = {
  DISPONIVEL: "Disponivel",
  VENDIDO: "Vendido",
  SOB_CONSULTA: "Sob consulta",
  ALUGADO: "Alugado",
};

function formatPrice(product: PublicProductListItem) {
  if (!product.priceVisible || product.priceCents === null) {
    return "Sob consulta";
  }

  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(product.priceCents / 100);
}

export function ProductCard({ product, whatsappPhone }: ProductCardProps) {
  const whatsappUrl = buildWhatsAppUrl({
    message: buildProductWhatsAppMessage({
      productName: product.name,
    }),
    phone: whatsappPhone,
  });

  return (
    <article className="group overflow-hidden rounded-lg border border-agromassa-border bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-agromassa-ink">
        <ProductCardImage
          alt={product.mainImage.altText}
          src={product.mainImage.publicUrl}
        />
        {product.isFeatured ? (
          <span className="absolute left-3 top-3 rounded-md bg-agromassa-green px-3 py-1 text-xs font-black uppercase text-white">
            Destaque
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-agromassa-cream px-2.5 py-1 text-xs font-black uppercase text-agromassa-forest">
            {categoryLabels[product.category] ?? product.category}
          </span>
          <span className="rounded-md bg-agromassa-ink px-2.5 py-1 text-xs font-black uppercase text-white">
            {statusLabels[product.status] ?? product.status}
          </span>
        </div>

        <h2 className="mt-4 text-xl font-black leading-tight text-agromassa-ink">
          {product.name}
        </h2>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="font-bold text-agromassa-muted">Marca</dt>
            <dd className="mt-1 font-black text-agromassa-ink">
              {product.brand}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-agromassa-muted">Modelo</dt>
            <dd className="mt-1 font-black text-agromassa-ink">
              {product.model}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-agromassa-muted">Condicao</dt>
            <dd className="mt-1 font-black text-agromassa-ink">
              {conditionLabels[product.condition] ?? product.condition}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-agromassa-muted">Local</dt>
            <dd className="mt-1 font-black text-agromassa-ink">
              {product.city}, {product.state}
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-agromassa-border pt-4">
          <p className="text-xs font-black uppercase text-agromassa-muted">
            Preco
          </p>
          <p className="mt-1 text-2xl font-black text-agromassa-forest">
            {formatPrice(product)}
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          {whatsappUrl ? (
            <a
              aria-label={`Chamar no WhatsApp sobre ${product.name}`}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-agromassa-green px-4 text-sm font-black text-white transition hover:bg-[#2f9714]"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              Chamar no WhatsApp
            </a>
          ) : null}
          <Link
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
            href={`/produtos/${product.slug}`}
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
