"use server";

import { revalidatePath } from "next/cache";

import { archiveProduct } from "@/features/products/archive-product";
import {
  deleteProductImage,
  ProductImageDeletionValidationError,
} from "@/features/products/delete-product-image";
import { saveProduct } from "@/features/products/save-product";
import { setMainProductImage } from "@/features/products/set-main-image";
import { updateProductQuickAction } from "@/features/products/update-product-quick-action";
import {
  ADMIN_SESSION_ERROR_MESSAGE,
  getActiveAdminId,
} from "@/lib/auth/admin-session";
import {
  adminQuickProductActionSchema,
  type AdminQuickProductActionInput,
} from "@/validators/products/admin-quick-action";
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

export type ProductQuickActionResult = {
  formError?: string;
  ok: boolean;
};

export type DeleteProductImageActionResult =
  | {
      nextMainImageId: string | null;
      ok: true;
      removedImageId: string;
      removedWasMain: boolean;
    }
  | {
      formError?: string;
      ok: false;
    };

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
      formError: ADMIN_SESSION_ERROR_MESSAGE,
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

  let result: Awaited<ReturnType<typeof saveProduct>>;

  try {
    result = await saveProduct({
      adminId,
      input: parsedInput.data,
      productId,
    });
  } catch {
    return {
      formError: "Nao foi possivel salvar o produto agora.",
      ok: false,
    };
  }

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
      formError: ADMIN_SESSION_ERROR_MESSAGE,
      ok: false,
    };
  }

  try {
    await archiveProduct({
      adminId,
      productId,
    });
  } catch {
    return {
      formError: "Nao foi possivel arquivar o produto agora.",
      ok: false,
    };
  }

  revalidatePath("/admin");
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
      formError: ADMIN_SESSION_ERROR_MESSAGE,
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

export async function updateProductQuickActionAction(
  rawInput: AdminQuickProductActionInput,
): Promise<ProductQuickActionResult> {
  const adminId = await getActiveAdminId();

  if (!adminId) {
    return {
      formError: ADMIN_SESSION_ERROR_MESSAGE,
      ok: false,
    };
  }

  const parsedInput = adminQuickProductActionSchema.safeParse(rawInput);

  if (!parsedInput.success) {
    return {
      formError: "Nao foi possivel validar a acao solicitada.",
      ok: false,
    };
  }

  let result: Awaited<ReturnType<typeof updateProductQuickAction>>;

  try {
    result = await updateProductQuickAction({
      adminId,
      input: parsedInput.data,
    });
  } catch {
    return {
      formError: "Nao foi possivel concluir a acao. Tente novamente.",
      ok: false,
    };
  }

  if (!result.ok) {
    return result;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${parsedInput.data.productId}`);
  revalidatePath("/produtos");

  return {
    ok: true,
  };
}

export async function deleteProductImageAction({
  imageId,
  productId,
}: {
  imageId: string;
  productId: string;
}): Promise<DeleteProductImageActionResult> {
  const adminId = await getActiveAdminId();

  if (!adminId) {
    return {
      formError: ADMIN_SESSION_ERROR_MESSAGE,
      ok: false,
    };
  }

  try {
    const result = await deleteProductImage({
      adminId,
      imageId,
      productId,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/produtos");
    revalidatePath(`/admin/produtos/${productId}`);
    revalidatePath("/produtos");

    return {
      ...result,
      ok: true,
    };
  } catch (error) {
    if (error instanceof ProductImageDeletionValidationError) {
      return {
        formError: error.message,
        ok: false,
      };
    }

    return {
      formError: "Nao foi possivel remover a imagem agora.",
      ok: false,
    };
  }
}
