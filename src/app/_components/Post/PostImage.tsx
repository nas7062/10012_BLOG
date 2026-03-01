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
    height={240}
    sizes="(max-width: 450px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
    priority={priority === true}
    loading={priority ? "eager" : "lazy"}
    className="rounded-md h-60 aspect-square object-cover w-full"
    quality={75}
  />
  );
}
