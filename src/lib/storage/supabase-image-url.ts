export function isSignedSupabaseImageUrl(src: string | null | undefined) {
  return typeof src === "string" && src.includes("/storage/v1/object/sign/");
}
