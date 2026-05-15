import type { NextConfig } from "next";

function getSupabaseImageRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return [];
  }

  try {
    const supabaseHost = new URL(supabaseUrl).hostname;

    return [
      {
        hostname: supabaseHost,
        pathname: "/storage/v1/object/**",
        protocol: "https",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: getSupabaseImageRemotePatterns(),
  },
};

export default nextConfig;
