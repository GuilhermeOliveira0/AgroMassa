import { z } from "zod";

const requiredText = (message: string, maxLength?: number) => {
  let schema = z.string().trim().min(1, message);

  if (maxLength) {
    schema = schema.max(maxLength, `Use no maximo ${maxLength} caracteres.`);
  }

  return schema;
};

export const siteSettingsFormSchema = z.object({
  city: requiredText("Informe a cidade.", 120),
  companyName: requiredText("Informe o nome da empresa.", 160),
  institutionalText: requiredText("Informe o texto institucional."),
  phoneDisplay: requiredText("Informe o telefone.", 40),
  servicesText: requiredText("Informe os servicos oferecidos."),
  state: requiredText("Informe o estado.", 2).length(
    2,
    "Use a sigla do estado com 2 letras.",
  ),
  whatsappDigits: requiredText("Informe o WhatsApp tecnico.", 20).regex(
    /^\d{10,15}$/,
    "Use apenas numeros, incluindo DDI e DDD.",
  ),
  whatsappDisplay: requiredText("Informe o WhatsApp exibido.", 40),
});

export type SiteSettingsFormInput = z.infer<typeof siteSettingsFormSchema>;

export type SiteSettingsFormFieldErrors = Partial<
  Record<keyof SiteSettingsFormInput, string>
>;

export function siteSettingsFormFieldErrors(
  result: ReturnType<typeof siteSettingsFormSchema.safeParse>,
): SiteSettingsFormFieldErrors {
  if (result.success) {
    return {};
  }

  const fields = result.error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(fields).map(([field, messages]) => [
      field,
      messages?.[0] ?? "",
    ]),
  ) as SiteSettingsFormFieldErrors;
}

export function siteSettingsFormInputFromFormData(
  formData: FormData,
): SiteSettingsFormInput {
  return {
    city: String(formData.get("city") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    institutionalText: String(formData.get("institutionalText") ?? ""),
    phoneDisplay: String(formData.get("phoneDisplay") ?? ""),
    servicesText: String(formData.get("servicesText") ?? ""),
    state: String(formData.get("state") ?? "").toUpperCase(),
    whatsappDigits: String(formData.get("whatsappDigits") ?? "").replace(
      /\D/g,
      "",
    ),
    whatsappDisplay: String(formData.get("whatsappDisplay") ?? ""),
  };
}
