import Link from "next/link";
import SearchInput from "./SearchInput";

import HeaderNav from "./HeaderNav";
import Image from "next/image";
import { HeaderClient } from "./HeaderClient";

export default async function Header() {
  return (
    <header className="h-20 relative flex items-center px-4 md:px-10 gap-2 md:gap-10 ">
      <Link
        className="text-2xl md:text-4xl font-semibold cursor-pointer"
        href="/"
      >
        <Image
          src="/logo10.png"
          alt="로고"
          width={50}
          height={50}
          className="w-20 h-20 sm:w-28 sm:h-28"
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
