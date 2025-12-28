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
      sizes="(max-width: 640px) 90vw,
       (max-width: 1024px) 45vw,
       240px"
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      className="rounded-md h-60 aspect-square object-cover w-full"
      quality={70}
      placeholder={priority ? "empty" : "blur"}
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkRMU/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIDESH/2gAMAwEAAhEDEQA/AD1wu5lKrWwKCiRdkJZPFSCHONVWNKLB7BGkqYSNMG5I2MkWk3bBtShIk2N2Mc8xY2Mk2NR6Q2NgqNPYq7h4EGxUamxkpNL1N0W8Xk/"
    />
  );
}
