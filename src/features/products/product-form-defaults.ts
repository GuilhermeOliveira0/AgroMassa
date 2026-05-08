import type { AdminProductFormInput } from "@/validators/products/admin-product";

export type EmptyProductFormValues = Omit<AdminProductFormInput, "intent"> & {
  images: [];
  mainImageUrl: null;
};

export function createEmptyProductFormValues(): EmptyProductFormValues {
  return {
    brand: "",
    category: "",
    city: "Sao Francisco",
    condition: "",
    description: "",
    images: [],
    isArchived: false,
    isFeatured: false,
    isPublicVisible: false,
    mainImageId: "",
    mainImageUrl: null,
    model: "",
    name: "",
    price: "",
    priceVisible: true,
    slug: "",
    state: "SP",
    status: "RASCUNHO",
    subcategory: "",
    technicalSpecs: "",
    year: "",
  };
}
