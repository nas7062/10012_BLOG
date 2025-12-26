import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function PostImage({ src, alt, priority }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      loading={!priority ? "lazy" : "eager"}
      height={300}
      sizes="
      (max-width: 450px) 100vw,
      (max-width: 768px) 50vw,
      (max-width: 1280px) 25vw,
      300px
    "
      priority={priority}
      className="rounded-md max-h-60 aspect-square"
    />
  );
}
