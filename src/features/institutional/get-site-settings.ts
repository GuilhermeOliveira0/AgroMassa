import { cache } from "react";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import type { SiteSettings } from "@/types/site-settings";

export type { PublicSiteSettings, SiteSettings } from "@/types/site-settings";

const siteSettingsSelect = {
  id: true,
  companyName: true,
  logoPath: true,
  institutionalText: true,
  servicesText: true,
  phoneDisplay: true,
  whatsappDisplay: true,
  whatsappDigits: true,
  city: true,
  state: true,
  updatedByAdminId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SiteSettingSelect;

type PersistedSiteSettings = Prisma.SiteSettingGetPayload<{
  select: typeof siteSettingsSelect;
}>;

const ACTIVE_LOGO_PATH = "/brand/agromassa1.jpeg";

const FALLBACK_SITE_SETTINGS: SiteSettings = {
  id: null,
  companyName: "AgroMassa",
  logoPath: ACTIVE_LOGO_PATH,
  institutionalText:
    "A AgroMassa atua na compra, venda, troca e locacao de tratores e implementos agricolas, conectando produtores rurais a maquinas e equipamentos adequados para o trabalho no campo.",
  servicesText:
    "Compra, venda, troca e locacao de tratores e implementos agricolas.",
  phoneDisplay: "17 99727-8876",
  whatsappDisplay: "17 99727-8876",
  whatsappDigits: "5517997278876",
  city: "Sao Francisco",
  state: "SP",
  updatedByAdminId: null,
  createdAt: null,
  updatedAt: null,
};

function mapSiteSettings(settings: PersistedSiteSettings): SiteSettings {
  return {
    id: settings.id,
    companyName: settings.companyName,
    logoPath: ACTIVE_LOGO_PATH,
    institutionalText: settings.institutionalText,
    servicesText: settings.servicesText,
    phoneDisplay: settings.phoneDisplay,
    whatsappDisplay: settings.whatsappDisplay,
    whatsappDigits: settings.whatsappDigits,
    city: settings.city,
    state: settings.state,
    updatedByAdminId: settings.updatedByAdminId,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await prisma.siteSetting.findFirst({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: siteSettingsSelect,
  });

  return settings ? mapSiteSettings(settings) : FALLBACK_SITE_SETTINGS;
});
