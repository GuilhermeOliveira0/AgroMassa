import { prisma } from "@/lib/db/prisma";
import type { SiteSettingsFormInput } from "@/validators/institutional/site-settings";

import { getSiteSettings } from "./get-site-settings";

export type SaveSiteSettingsResult =
  | {
      ok: true;
    }
  | {
      formError: string;
      ok: false;
    };

function clean(value: string) {
  return value.trim();
}

export async function saveSiteSettings({
  adminId,
  input,
}: {
  adminId: string;
  input: SiteSettingsFormInput;
}): Promise<SaveSiteSettingsResult> {
  const currentSettings = await getSiteSettings();
  const data = {
    city: clean(input.city),
    companyName: clean(input.companyName),
    institutionalText: clean(input.institutionalText),
    logoPath: currentSettings.logoPath,
    phoneDisplay: clean(input.phoneDisplay),
    servicesText: clean(input.servicesText),
    state: clean(input.state).toUpperCase(),
    updatedByAdminId: adminId,
    whatsappDigits: clean(input.whatsappDigits),
    whatsappDisplay: clean(input.whatsappDisplay),
  };

  if (!currentSettings.id) {
    await prisma.siteSetting.create({
      data,
    });

    return {
      ok: true,
    };
  }

  await prisma.siteSetting.update({
    data,
    where: {
      id: currentSettings.id,
    },
  });

  return {
    ok: true,
  };
}
