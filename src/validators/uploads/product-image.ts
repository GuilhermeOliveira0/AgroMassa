const PRODUCT_IMAGE_TYPE_EXTENSIONS = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
} as const;

const PRODUCT_IMAGE_STORAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES_PER_PRODUCT = 8;
export const PRODUCT_IMAGE_MIME_TYPES = Object.keys(
  PRODUCT_IMAGE_TYPE_EXTENSIONS,
);

function originalFilenameExtension(filename: string) {
  const extension = filename.trim().split(".").pop();

  return extension?.toLowerCase();
}

export function productImageExtensionForMimeType(mimeType: string) {
  return PRODUCT_IMAGE_STORAGE_EXTENSIONS[
    mimeType as keyof typeof PRODUCT_IMAGE_STORAGE_EXTENSIONS
  ];
}

export function validateProductImageFile(file: File): string | null {
  if (file.size <= 0) {
    return "Arquivo vazio nao pode ser enviado.";
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    return "Imagem acima do limite de 5 MB.";
  }

  const allowedExtensions =
    PRODUCT_IMAGE_TYPE_EXTENSIONS[
      file.type as keyof typeof PRODUCT_IMAGE_TYPE_EXTENSIONS
    ];

  if (!allowedExtensions) {
    return "Formato invalido. Envie JPG, PNG ou WEBP.";
  }

  const extension = originalFilenameExtension(file.name);

  if (
    !extension ||
    !(allowedExtensions as readonly string[]).includes(extension)
  ) {
    return "Extensao invalida. Envie JPG, PNG ou WEBP.";
  }

  return null;
}
