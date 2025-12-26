import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function PostImage({ src, alt, priority }: Props) {
  console.log(priority);
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={300}
      priority={priority}
      className="rounded-md max-h-60 aspect-square"
    />
  );
}
