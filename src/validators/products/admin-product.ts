import { z } from "zod";

export const ADMIN_PRODUCT_CATEGORY_VALUES = ["TRATORES", "IMPLEMENTOS"] as const;
export const ADMIN_PRODUCT_CONDITION_VALUES = [
  "NOVO",
  "USADO",
  "SEMINOVO",
] as const;
export const ADMIN_PRODUCT_STATUS_VALUES = [
  "DISPONIVEL",
  "VENDIDO",
  "SOB_CONSULTA",
  "ALUGADO",
  "RASCUNHO",
] as const;

export const adminProductFormIntentSchema = z.enum(["draft", "publish"]);

const optionalEnumValue = <T extends readonly [string, ...string[]]>(
  values: T,
) => z.union([z.enum(values), z.literal("")]);

const optionalText = z.string().trim();

function isOptionalPositiveInteger(value: string) {
  if (!value) {
    return true;
  }

  return /^\d+$/.test(value) && Number.parseInt(value, 10) > 0;
}

function isOptionalMoneyValue(value: string) {
  if (!value) {
    return true;
  }

  return /^\d+([,.]\d{1,2})?$/.test(value);
}

export const adminProductFormSchema = z
  .object({
    brand: optionalText,
    category: optionalEnumValue(ADMIN_PRODUCT_CATEGORY_VALUES),
    city: optionalText,
    condition: optionalEnumValue(ADMIN_PRODUCT_CONDITION_VALUES),
    description: optionalText,
    intent: adminProductFormIntentSchema,
    isArchived: z.boolean(),
    isFeatured: z.boolean(),
    isPublicVisible: z.boolean(),
    mainImageId: optionalText,
    model: optionalText,
    name: optionalText,
    price: optionalText.refine(isOptionalMoneyValue, {
      message: "Informe um preco valido.",
    }),
    priceVisible: z.boolean(),
    slug: optionalText,
    state: optionalText,
    status: z.enum(ADMIN_PRODUCT_STATUS_VALUES),
    subcategory: optionalText,
    technicalSpecs: optionalText,
    year: optionalText.refine(isOptionalPositiveInteger, {
      message: "Informe um ano valido.",
    }),
  })
  .superRefine((data, context) => {
    if (!data.name) {
      context.addIssue({
        code: "custom",
        message: "Informe o nome do produto.",
        path: ["name"],
      });
    }

    if (data.intent === "draft") {
      return;
    }

    const requiredFields: Array<keyof typeof data> = [
      "slug",
      "category",
      "subcategory",
      "brand",
      "model",
      "condition",
      "description",
      "technicalSpecs",
      "city",
      "state",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        context.addIssue({
          code: "custom",
          message: "Campo obrigatorio para publicar.",
          path: [field],
        });
      }
    }

    if (data.status === "RASCUNHO") {
      context.addIssue({
        code: "custom",
        message: "Escolha um status publicavel.",
        path: ["status"],
      });
    }

    if (!data.mainImageId) {
      context.addIssue({
        code: "custom",
        message: "Produto publicado precisa de foto principal.",
        path: ["mainImageId"],
      });
    }

    if (data.state && data.state.length !== 2) {
      context.addIssue({
        code: "custom",
        message: "Use a sigla do estado com 2 letras.",
        path: ["state"],
      });
    }
  });

export type AdminProductFormInput = z.infer<typeof adminProductFormSchema>;
