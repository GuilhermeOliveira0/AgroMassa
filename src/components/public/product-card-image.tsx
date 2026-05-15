import Image from "next/image";

import { isSignedSupabaseImageUrl } from "@/lib/storage/supabase-image-url";

type ProductCardImageProps = {
  alt: string;
  priority?: boolean;
  sizes?: string;
  src: string | null | undefined;
};

const PRODUCT_IMAGE_FALLBACK = "/brand/agromassa1.jpeg";
const DEFAULT_PRODUCT_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export function ProductCardImage({
  alt,
  priority = false,
  sizes = DEFAULT_PRODUCT_IMAGE_SIZES,
  src,
}: ProductCardImageProps) {
  const imageSrc = src || PRODUCT_IMAGE_FALLBACK;

  return (
    <div className="relative h-full w-full">
      <Image
        alt={alt}
        className="object-cover transition duration-300 group-hover:scale-[1.03]"
        fill
        priority={priority}
        sizes={sizes}
        src={imageSrc}
        unoptimized={isSignedSupabaseImageUrl(imageSrc)}
      />
    </div>
  );
}
