type ProductPublicationReadinessInput = {
  brand: string | null;
  category: string | null;
  city: string | null;
  condition: string | null;
  description: string | null;
  mainImageId: string | null;
  model: string | null;
  slug: string;
  state: string | null;
  subcategory: string | null;
  technicalSpecs: string | null;
};

function hasTextValue(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export function getProductPublicationBlockReason(
  product: ProductPublicationReadinessInput,
) {
  const state = product.state?.trim() ?? "";

  if (!hasTextValue(product.slug)) {
    return "Defina um slug valido antes de publicar este produto.";
  }

  if (!product.category || !product.condition) {
    return "Complete categoria e condicao antes de publicar este produto.";
  }

  if (
    !hasTextValue(product.subcategory) ||
    !hasTextValue(product.brand) ||
    !hasTextValue(product.model) ||
    !hasTextValue(product.description) ||
    !hasTextValue(product.technicalSpecs) ||
    !hasTextValue(product.city)
  ) {
    return "Complete os campos obrigatorios antes de publicar este produto.";
  }

  if (!state || state.length !== 2) {
    return "Use a sigla do estado com 2 letras antes de publicar este produto.";
  }

  if (!product.mainImageId) {
    return "Defina uma foto principal antes de publicar ou exibir este produto.";
  }

  return null;
}

export function canProductBePublished(
  product: ProductPublicationReadinessInput,
) {
  return !getProductPublicationBlockReason(product);
}
