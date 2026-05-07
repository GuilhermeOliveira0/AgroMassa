const DEFAULT_COUNTRY_CODE = "55";
const WHATSAPP_BASE_URL = "https://wa.me";

export type BuildWhatsAppUrlParams = {
  phone: string | null | undefined;
  message?: string | null;
};

export type ProductWhatsAppMessageParams = {
  productPath?: string | null;
  productName: string;
};

export function normalizeWhatsAppPhone(
  phone: string | null | undefined,
): string | null {
  const digits = phone?.replace(/\D/g, "") ?? "";

  if (!digits) {
    return null;
  }

  if (
    digits.startsWith(DEFAULT_COUNTRY_CODE) &&
    (digits.length === 12 || digits.length === 13)
  ) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `${DEFAULT_COUNTRY_CODE}${digits}`;
  }

  return null;
}

export function buildProductWhatsAppMessage({
  productPath,
  productName,
}: ProductWhatsAppMessageParams): string {
  const safeProductPath = productPath?.trim();

  return [
    "Ola! Tenho interesse neste produto:",
    "",
    `Produto: ${productName}`,
    safeProductPath ? `Link: ${safeProductPath}` : null,
    "",
    "Gostaria de mais informacoes.",
  ]
    .filter((messagePart): messagePart is string => messagePart !== null)
    .join("\n");
}

export function buildInstitutionalWhatsAppMessage(): string {
  return "Ola, gostaria de falar com a AgroMassa.";
}

export function buildWhatsAppUrl({
  phone,
  message,
}: BuildWhatsAppUrlParams): string | null {
  const normalizedPhone = normalizeWhatsAppPhone(phone);

  if (!normalizedPhone) {
    return null;
  }

  const url = new URL(`${WHATSAPP_BASE_URL}/${normalizedPhone}`);
  const safeMessage = message?.trim();

  if (safeMessage) {
    url.searchParams.set("text", safeMessage);
  }

  return url.toString();
}
