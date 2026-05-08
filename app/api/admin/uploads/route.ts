import { NextResponse } from "next/server";

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
    const image = await uploadProductImage({
      file,
      productId: firstFormValue(formData.get("productId")),
    });

    return NextResponse.json({
      image: {
        ...image,
        height: null,
        width: null,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Nao foi possivel enviar a imagem. Revise o storage e tente novamente.",
      },
      {
        status: 500,
      },
    );
  }
}
