"use client";

import dynamic from "next/dynamic";

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

const HeaderClient = dynamic(
  () => import("./HeaderClient").then((m) => ({ default: m.HeaderClient })),
  {
    ssr: false,
    loading: () => (
      <div className="ml-auto flex items-center gap-4">
        <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-2xl" />
      </div>
    ),
  }
);

export default function HeaderDynamic() {
  return (
    <>
      <HeaderNav />
      <HeaderClient />
    </>
  );
}