import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function UserImage({ src, alt, priority }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      priority={priority}
      className="rounded-full aspect-square cursor-pointer"
    />
  );
}
