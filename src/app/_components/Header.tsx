import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import SearchInput from "./SearchInput";


const HeaderNav = dynamic(() => import("./HeaderNav"), {
  ssr: false,
  loading: () => (
    <nav className="absolute top-20 left-4 sm:left-1/6">
      <ul className="flex text-xl gap-2 sm:gap-8">
        <li className="w-14 sm:w-[73px] h-6 bg-gray-200 animate-pulse rounded" />
        <li className="w-14 sm:w-[73px] h-6 bg-gray-200 animate-pulse rounded" />
        <li className="w-14 sm:w-[73px] h-6 bg-gray-200 animate-pulse rounded" />
      </ul>
    </nav>
  ),
});

const HeaderClient = dynamic(() => import("./HeaderClient").then(mod => ({ default: mod.HeaderClient })), {
  ssr: false,
  loading: () => (
    <div className="ml-auto flex items-center gap-4">
      <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-2xl" />
    </div>
  ),
});

export default async function Header() {
  return (
    <header className="h-20 relative flex items-center px-2 md:px-10 gap-2 md:gap-10">
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