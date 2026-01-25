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
      width={240}
      height={240}
      sizes="240px"
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      className="rounded-md h-60 aspect-square object-cover w-full"
      quality={70}
      placeholder="empty"
    />
  );
}
