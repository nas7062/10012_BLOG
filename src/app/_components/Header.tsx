import Link from "next/link";
import SearchInput from "./SearchInput";
import Image from "next/image";
import HeaderDynamic from "./HeaderDynamic";

export default async function Header() {
  return (
    <header className="h-20 relative flex items-center px-2 md:px-10 gap-2 md:gap-10 ">
      <Link className="text-2xl md:text-4xl font-semibold cursor-pointer" href="/">
        <Image
          src="/logo10.png"
          alt="로고"
          priority
          fetchPriority="high"
          width={112}
          height={112}
          sizes="(max-width: 640px) 80px, 112px"
          className="w-20 h-20 sm:w-28 sm:h-28"
          quality={75}
        />
      </Link>
      <div className="flex-1">
        <SearchInput />
      </div>
      <HeaderDynamic />
    </header>
  );
}