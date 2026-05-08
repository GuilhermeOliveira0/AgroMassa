import { createClient } from "@supabase/supabase-js";

const SUPPORTED_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_MIME_TYPES = Object.keys(SUPPORTED_IMAGE_TYPES);

export type ProductImageUploadInput = {
  file: File;
  productId?: string;
};

export type ProductImageUploadResult = {
  fileSizeBytes: number;
  mimeType: string;
  originalFilename: string;
  publicUrl: string;
  storageKey: string;
};

function getSupabaseStorageConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    throw new Error("Supabase Storage environment variables are not configured.");
  }

  return {
    bucket,
    serviceRoleKey,
    supabaseUrl,
  };
}

function createSupabaseStorageClient() {
  const { serviceRoleKey, supabaseUrl } = getSupabaseStorageConfig();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

function fileExtensionForMimeType(mimeType: string) {
  return SUPPORTED_IMAGE_TYPES[mimeType as keyof typeof SUPPORTED_IMAGE_TYPES];
}

function safeOriginalFilename(filename: string) {
  const cleaned = filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 255);

  return cleaned || "produto-imagem";
}

function storagePrefix(productId?: string) {
  return productId ? `products/${productId}` : "products/unassigned";
}

export function validateProductImageFile(file: File): string | null {
  if (file.size <= 0) {
    return "Arquivo vazio nao pode ser enviado.";
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    return "Imagem acima do limite de 5 MB.";
  }

  if (!fileExtensionForMimeType(file.type)) {
    return "Formato invalido. Envie JPG, PNG ou WEBP.";
  }

  return null;
}

export async function uploadProductImage({
  file,
  productId,
}: ProductImageUploadInput): Promise<ProductImageUploadResult> {
  const validationError = validateProductImageFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const { bucket } = getSupabaseStorageConfig();
  const supabase = createSupabaseStorageClient();
  const extension = fileExtensionForMimeType(file.type);
  const storageKey = `${storagePrefix(productId)}/${crypto.randomUUID()}.${extension}`;
  const fileBytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(storageKey, fileBytes, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storageKey);

  return {
    fileSizeBytes: file.size,
    mimeType: file.type,
    originalFilename: safeOriginalFilename(file.name),
    publicUrl: data.publicUrl,
    storageKey,
  };
}

export async function getProductImageDisplayUrl({
  publicUrl,
  storageKey,
}: {
  publicUrl: string;
  storageKey: string;
}) {
  try {
    const { bucket } = getSupabaseStorageConfig();
    const supabase = createSupabaseStorageClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storageKey, 60 * 60 * 24);

    if (!error && data.signedUrl) {
      return data.signedUrl;
    }
  } catch {
    return publicUrl;
  }

  return publicUrl;
}
