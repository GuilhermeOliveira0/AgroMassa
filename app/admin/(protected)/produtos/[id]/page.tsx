import { notFound } from "next/navigation";

import {
  type ProductFormInitialValues,
  ProductForm,
} from "@/components/admin/product-form";
import {
  type AdminProductDetail,
  getAdminProductById,
} from "@/features/products/get-admin-product-by-id";

export const dynamic = "force-dynamic";

type AdminProductEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPriceForForm(priceCents: number | null) {
  if (priceCents === null) {
    return "";
  }

  return (priceCents / 100).toFixed(2).replace(".", ",");
}

function formatOptionalNumber(value: number | null) {
  return value === null ? "" : String(value);
}

function productToInitialValues(
  product: AdminProductDetail,
): ProductFormInitialValues {
  return {
    brand: product.brand ?? "",
    category: product.category ?? "",
    city: product.city ?? "",
    condition: product.condition ?? "",
    description: product.description ?? "",
    id: product.id,
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    isPublicVisible: product.isPublicVisible,
    images: product.images,
    mainImageId: product.mainImageId ?? "",
    mainImageUrl: product.mainImage?.publicUrl ?? null,
    model: product.model ?? "",
    name: product.name,
    price: formatPriceForForm(product.priceCents),
    priceVisible: product.priceVisible,
    slug: product.slug,
    state: product.state ?? "",
    status: product.status,
    subcategory: product.subcategory ?? "",
    technicalSpecs: product.technicalSpecs ?? "",
    year: formatOptionalNumber(product.year),
  };
}

export default async function AdminProductEditPage({
  params,
}: AdminProductEditPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <ProductForm initialValues={productToInitialValues(product)} mode="edit" />
    </main>
  );
}
