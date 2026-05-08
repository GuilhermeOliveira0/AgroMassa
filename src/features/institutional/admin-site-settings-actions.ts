"use server";

import { revalidatePath } from "next/cache";

import {
  ADMIN_SESSION_ERROR_MESSAGE,
  getActiveAdminId,
} from "@/lib/auth/admin-session";
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

export async function saveSiteSettingsAction(
  formData: FormData,
): Promise<SiteSettingsFormActionResult> {
  const adminId = await getActiveAdminId();

  if (!adminId) {
    return {
      formError: ADMIN_SESSION_ERROR_MESSAGE,
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

  let result: Awaited<ReturnType<typeof saveSiteSettings>>;

  try {
    result = await saveSiteSettings({
      adminId,
      input: parsedInput.data,
    });
  } catch {
    return {
      formError: "Nao foi possivel salvar as configuracoes agora.",
      ok: false,
    };
  }

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
