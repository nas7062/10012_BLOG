import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function PostImage({ src, alt }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={300}
      priority
      className="rounded-md max-h-60 aspect-square"
    />
  );
}
