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
      loading={priority ? "eager" : "lazy"}
      sizes="40px"
      className="rounded-full aspect-square cursor-pointer object-cover"
      quality={80}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkRMU/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIDESH/2gAMAwEAAhEDEQA/AD1wu5lKrWwKCiRdkJZPFSCHONVWNKLB7BGkqYSNMG5I2MkWk3bBtShIk2N2Mc8xY2Mk2NR6Q2NgqNPYq7h4EGxUamxkpNL1N0W8Xk/"
    />
  );
}
