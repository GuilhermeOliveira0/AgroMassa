"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthSession } from "@/lib/auth/auth";
import { archiveProduct } from "@/features/products/archive-product";
import { saveProduct } from "@/features/products/save-product";
import { setMainProductImage } from "@/features/products/set-main-image";
import {
  adminProductFormFieldErrors,
  adminProductFormInputFromFormData,
  adminProductFormSchema,
  type AdminProductFormFieldErrors,
  type AdminProductFormInput,
} from "@/validators/products/admin-product";

export type ProductFormActionResult = {
  fieldErrors?: AdminProductFormFieldErrors;
  formError?: string;
  ok: boolean;
  redirectTo?: string;
};

async function getActiveAdminId() {
  const session = await getServerAuthSession();

  if (!session?.user?.id || !session.user.isActive) {
    return null;
  }

  return session.user.id;
}

export async function saveProductAction({
  formData,
  intent,
  productId,
}: {
  formData: FormData;
  intent: AdminProductFormInput["intent"];
  productId?: string;
}): Promise<ProductFormActionResult> {
  const adminId = await getActiveAdminId();

  if (!adminId) {
    return {
      formError: "Sessao administrativa invalida. Faca login novamente.",
      ok: false,
    };
  }

  const input = adminProductFormInputFromFormData(formData, intent);
  const parsedInput = adminProductFormSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      fieldErrors: adminProductFormFieldErrors(parsedInput),
      formError: "Revise os campos destacados.",
      ok: false,
    };
  }

  const result = await saveProduct({
    adminId,
    input: parsedInput.data,
    productId,
  });

  if (!result.ok) {
    return {
      fieldErrors: result.fieldErrors,
      formError: result.formError,
      ok: false,
    };
  }

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${result.productId}`);
  revalidatePath("/produtos");

  return {
    ok: true,
    redirectTo: `/admin/produtos/${result.productId}`,
  };
}

export async function archiveProductAction(
  productId: string,
): Promise<ProductFormActionResult> {
  const adminId = await getActiveAdminId();

  if (!adminId) {
    return {
      formError: "Sessao administrativa invalida. Faca login novamente.",
      ok: false,
    };
  }

  await archiveProduct({
    adminId,
    productId,
  });

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");

  return {
    ok: true,
    redirectTo: `/admin/produtos/${productId}`,
  };
}

export async function setMainProductImageAction({
  imageId,
  productId,
}: {
  imageId: string;
  productId: string;
}): Promise<ProductFormActionResult> {
  const adminId = await getActiveAdminId();

  if (!adminId) {
    return {
      formError: "Sessao administrativa invalida. Faca login novamente.",
      ok: false,
    };
  }

  try {
    await setMainProductImage({
      adminId,
      imageId,
      productId,
    });
  } catch {
    return {
      formError: "Nao foi possivel definir a imagem principal.",
      ok: false,
    };
  }

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");

  return {
    ok: true,
  };
}
