import { prisma } from "@/lib/db/prisma";

export type PublicSiteSettings = {
  companyName: string;
  logoPath: string;
  institutionalText: string;
  servicesText: string;
  phoneDisplay: string;
  whatsappDisplay: string;
  whatsappDigits: string;
  city: string;
  state: string;
};

const FALLBACK_SITE_SETTINGS: PublicSiteSettings = {
  companyName: "AgroMassa",
  logoPath: "/brand/agromassa.jpeg",
  institutionalText:
    "A AgroMassa atua na compra, venda, troca e locacao de tratores e implementos agricolas, conectando produtores rurais a maquinas e equipamentos adequados para o trabalho no campo.",
  servicesText:
    "Compra, venda, troca e locacao de tratores e implementos agricolas.",
  phoneDisplay: "17 99727-8876",
  whatsappDisplay: "17 99727-8876",
  whatsappDigits: "5517997278876",
  city: "Sao Francisco",
  state: "SP",
};

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  const settings = await prisma.siteSetting.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      companyName: true,
      logoPath: true,
      institutionalText: true,
      servicesText: true,
      phoneDisplay: true,
      whatsappDisplay: true,
      whatsappDigits: true,
      city: true,
      state: true,
    },
  });

  return settings ?? FALLBACK_SITE_SETTINGS;
}
