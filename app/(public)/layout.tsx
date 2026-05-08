import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteSettings } from "@/features/institutional/get-site-settings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-agromassa-cream text-agromassa-ink">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter settings={settings} />
    </div>
  );
}
