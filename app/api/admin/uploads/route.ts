import { NextResponse } from "next/server";

import {
  attachProductImage,
  ProductImageAttachmentValidationError,
  validateProductImageAttachmentTarget,
} from "@/features/products/attach-product-image";
import { getActiveAdminId } from "@/lib/auth/admin-session";
import {
  adminBadRequestResponse,
  adminServerErrorResponse,
  adminUnauthorizedResponse,
} from "@/lib/http/admin-api-responses";
import {
  getProductImageDisplayUrl,
  uploadProductImage,
} from "@/lib/storage/supabase-storage";
import {
  PRODUCT_IMAGE_MIME_TYPES,
  validateProductImageFile,
} from "@/validators/uploads/product-image";

export const runtime = "nodejs";

function firstFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : undefined;
}

function parseMainFlag(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return true;
  }

  return value !== "false";
}

function isMultipartRequest(request: Request) {
  return request.headers.get("content-type")?.includes("multipart/form-data");
}

export async function POST(request: Request) {
  const adminId = await getActiveAdminId();

  if (!adminId) {
    return adminUnauthorizedResponse();
  }

  if (!isMultipartRequest(request)) {
    return adminBadRequestResponse("Envie uma requisicao multipart/form-data.");
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return adminBadRequestResponse("Nao foi possivel ler os dados do upload.");
  }

  const file = formData.get("file");
  const productId = firstFormValue(formData.get("productId"));

  if (!(file instanceof File)) {
    return adminBadRequestResponse("Envie uma imagem no campo file.");
  }

  if (!productId) {
    return adminBadRequestResponse("Informe o produto para vincular a imagem.");
  }

  const validationError = validateProductImageFile(file);

  if (validationError) {
    return adminBadRequestResponse(validationError, {
      supportedTypes: PRODUCT_IMAGE_MIME_TYPES,
    });
  }

  try {
    await validateProductImageAttachmentTarget(productId);

    const uploadedImage = await uploadProductImage({
      file,
      productId,
    });
    const image = await attachProductImage({
      ...uploadedImage,
      adminId,
      height: null,
      isMain: parseMainFlag(formData.get("isMain")),
      productId,
      width: null,
    });
    const displayUrl = await getProductImageDisplayUrl({
      publicUrl: image.publicUrl,
      storageKey: image.storageKey,
    });

    return NextResponse.json({
      image: {
        ...image,
        publicUrl: displayUrl,
      },
    });
  } catch (error) {
    if (error instanceof ProductImageAttachmentValidationError) {
      return adminBadRequestResponse(error.message);
    }

    return adminServerErrorResponse();
  }
}
