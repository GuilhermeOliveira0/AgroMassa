import { createClient } from "@supabase/supabase-js";
import { existsSync } from "node:fs";
import path from "node:path";

import {
  productImageExtensionForMimeType,
  validateProductImageFile,
} from "@/validators/uploads/product-image";

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

const PRODUCT_IMAGE_FALLBACK = "/brand/agromassa1.jpeg";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;
const SIGNED_URL_CACHE_TTL_MS = 60 * 60 * 23 * 1000;

type SignedUrlCacheEntry = {
  expiresAt: number;
  signedUrl: string;
};

const signedUrlCache = new Map<string, SignedUrlCacheEntry>();

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

function localPublicFileExists(publicPath: string) {
  const normalizedPath = publicPath.startsWith("/")
    ? publicPath.slice(1)
    : publicPath;
  const publicFilePath = path.join(process.cwd(), "public", normalizedPath);

  return existsSync(publicFilePath);
}

function resolveLocalProductImageUrl(publicUrl: string) {
  if (!publicUrl.startsWith("/")) {
    return null;
  }

  return localPublicFileExists(publicUrl) ? publicUrl : PRODUCT_IMAGE_FALLBACK;
}

function createSupabaseStorageClient() {
  const { serviceRoleKey, supabaseUrl } = getSupabaseStorageConfig();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
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
  const extension = productImageExtensionForMimeType(file.type);

  if (!extension) {
    throw new Error("Formato invalido. Envie JPG, PNG ou WEBP.");
  }

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
  const localImageUrl = resolveLocalProductImageUrl(publicUrl);

  if (localImageUrl) {
    return localImageUrl;
  }

  const cachedSignedUrl = signedUrlCache.get(storageKey);
  const now = Date.now();

  if (cachedSignedUrl && cachedSignedUrl.expiresAt > now) {
    return cachedSignedUrl.signedUrl;
  }

  try {
    const { bucket } = getSupabaseStorageConfig();
    const supabase = createSupabaseStorageClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storageKey, SIGNED_URL_TTL_SECONDS);

    if (!error && data.signedUrl) {
      signedUrlCache.set(storageKey, {
        expiresAt: now + SIGNED_URL_CACHE_TTL_MS,
        signedUrl: data.signedUrl,
      });
      return data.signedUrl;
    }
  } catch {
    return publicUrl;
  }

  return publicUrl;
}
