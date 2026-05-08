"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthSession } from "@/lib/auth/auth";
import {
  siteSettingsFormFieldErrors,
  siteSettingsFormInputFromFormData,
  siteSettingsFormSchema,
  type SiteSettingsFormFieldErrors,
} from "@/validators/institutional/site-settings";

import { saveSiteSettings } from "./save-site-settings";

export type SiteSettingsFormActionResult = {
  fieldErrors?: SiteSettingsFormFieldErrors;
  formError?: string;
  ok: boolean;
};

async function getActiveAdminId() {
  const session = await getServerAuthSession();

  if (!session?.user?.id || !session.user.isActive) {
    return null;
  }

  return session.user.id;
}

export async function saveSiteSettingsAction(
  formData: FormData,
): Promise<SiteSettingsFormActionResult> {
  const adminId = await getActiveAdminId();

  if (!adminId) {
    return {
      formError: "Sessao administrativa invalida. Faca login novamente.",
      ok: false,
    };
  }

  const parsedInput = siteSettingsFormSchema.safeParse(
    siteSettingsFormInputFromFormData(formData),
  );

  if (!parsedInput.success) {
    return {
      fieldErrors: siteSettingsFormFieldErrors(parsedInput),
      formError: "Revise os campos destacados.",
      ok: false,
    };
  }

  const result = await saveSiteSettings({
    adminId,
    input: parsedInput.data,
  });

  if (!result.ok) {
    return {
      formError: result.formError,
      ok: false,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/institucional");
  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  revalidatePath("/produtos", "page");
  revalidatePath("/produtos/[slug]", "page");

  return {
    ok: true,
  };
}
