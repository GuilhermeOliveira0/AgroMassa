import { NextResponse } from "next/server";

import {
  attachProductImage,
  validateProductImageAttachmentTarget,
} from "@/features/products/attach-product-image";
import { getServerAuthSession } from "@/lib/auth/auth";
import {
  PRODUCT_IMAGE_MIME_TYPES,
  uploadProductImage,
  validateProductImageFile,
} from "@/lib/storage/supabase-storage";

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

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user?.id || !session.user.isActive) {
    return NextResponse.json(
      {
        error: "Acesso administrativo necessario.",
      },
      {
        status: 401,
      },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const productId = firstFormValue(formData.get("productId"));

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        error: "Envie uma imagem no campo file.",
      },
      {
        status: 400,
      },
    );
  }

  if (!productId) {
    return NextResponse.json(
      {
        error: "Informe o produto para vincular a imagem.",
      },
      {
        status: 400,
      },
    );
  }

  const validationError = validateProductImageFile(file);

  if (validationError) {
    return NextResponse.json(
      {
        error: validationError,
        supportedTypes: PRODUCT_IMAGE_MIME_TYPES,
      },
      {
        status: 400,
      },
    );
  }

  try {
    await validateProductImageAttachmentTarget(productId);

    const uploadedImage = await uploadProductImage({
      file,
      productId,
    });
    const image = await attachProductImage({
      ...uploadedImage,
      adminId: session.user.id,
      height: null,
      isMain: parseMainFlag(formData.get("isMain")),
      productId,
      width: null,
    });

    return NextResponse.json({
      image,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel enviar a imagem.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}
