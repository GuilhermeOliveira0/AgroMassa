export type SiteSettings = {
  id: string | null;
  companyName: string;
  logoPath: string;
  institutionalText: string;
  servicesText: string;
  phoneDisplay: string;
  whatsappDisplay: string;
  whatsappDigits: string;
  city: string;
  state: string;
  updatedByAdminId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type PublicSiteSettings = SiteSettings;
