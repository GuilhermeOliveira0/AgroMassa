type ProductCardImageProps = {
  alt: string;
  src: string;
};

export function ProductCardImage({ alt, src }: ProductCardImageProps) {
  return (
    <div
      aria-label={alt}
      className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-[1.03]"
      role="img"
      style={{
        backgroundImage: `url("${src.replaceAll('"', '\\"')}"), url("/brand/agromassa1.jpeg")`,
      }}
    />
  );
}
