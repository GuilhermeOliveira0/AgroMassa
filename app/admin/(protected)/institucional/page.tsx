import { InstitutionalForm } from "@/components/admin/institutional-form";
import { getSiteSettings } from "@/features/institutional/get-site-settings";
import type { SiteSettingsFormInput } from "@/validators/institutional/site-settings";

export const dynamic = "force-dynamic";

function settingsToInitialValues(
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
): SiteSettingsFormInput {
  return {
    city: settings.city,
    companyName: settings.companyName,
    institutionalText: settings.institutionalText,
    phoneDisplay: settings.phoneDisplay,
    servicesText: settings.servicesText,
    state: settings.state,
    whatsappDigits: settings.whatsappDigits,
    whatsappDisplay: settings.whatsappDisplay,
  };
}

export default async function AdminInstitutionalPage() {
  const settings = await getSiteSettings();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <InstitutionalForm initialValues={settingsToInitialValues(settings)} />
    </main>
  );
}
