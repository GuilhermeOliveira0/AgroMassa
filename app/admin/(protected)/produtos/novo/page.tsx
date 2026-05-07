import {
  createEmptyProductFormValues,
  ProductForm,
} from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <ProductForm initialValues={createEmptyProductFormValues()} mode="create" />
    </main>
  );
}
