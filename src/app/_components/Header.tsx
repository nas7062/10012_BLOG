import Link from "next/link";
import SearchInput from "./SearchInput";

import HeaderNav from "./HeaderNav";
import Image from "next/image";
import { HeaderClient } from "./HeaderClient";

export default async function Header() {
  return (
    <header className="h-20 relative flex items-center md:px-10 gap-2 md:gap-10 ">
      <Link
        className="text-2xl md:text-4xl font-semibold cursor-pointer"
        href="/"
      >
        <Image
          src="/logo10.png"
          alt="로고"
          priority
          width={112}
          height={112}
          sizes="(max-width: 640px) 80px, 112px"
          className="w-20 h-20 sm:w-28 sm:h-28"
          quality={90}
        />
      </Link>
      <HeaderNav />
      <div className="flex-1">
        <SearchInput />
      </div>
      <HeaderClient />
    </header>
  );
}
