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
      height={300}
      sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 300px, 300px"
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className="rounded-md max-h-60 aspect-square object-cover"
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkRMU/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIDESH/2gAMAwEAAhEDEQA/AD1wu5lKrWwKCiRdkJZPFSCHONVWNKLB7BGkqYSNMG5I2MkWk3bBtShIk2N2Mc8xY2Mk2NR6Q2NgqNPYq7h4EGxUamxkpNL1N0W8Xk/"
    />
  );
}
