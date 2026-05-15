import { AboutSection } from "@/components/public/about-section";
import { HomeHero } from "@/components/public/home-hero";
import { getSiteSettings } from "@/features/institutional/get-site-settings";

export const revalidate = 60;

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <main>
      <HomeHero settings={settings} />
      <AboutSection settings={settings} />
    </main>
  );
}
