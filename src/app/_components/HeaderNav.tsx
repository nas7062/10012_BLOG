"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ChartBar, Heart, Home, List, Newspaper } from "lucide-react";

const NAV = {
  "": { label: "홈", icon: Home },
  feed: { label: "피드", icon: List },
  like: { label: "좋아요", icon: Heart },
  news: { label: "뉴스", icon: Newspaper },
  chart: { label: "차트", icon: ChartBar },
} as const;

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute top-20 left-4 sm:left-1/6 ">
      <ul className="flex text-xl gap-2 sm:gap-8">
        {Object.entries(NAV).map(([key, v]) => {
          const href = key === "" ? "/" : `/${key}`;
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          const Icon = v.icon;
          return (
            <li
              key={key}
              className={clsx(
                "relative pb-1 cursor-pointer w-14 sm:w-[73px] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full",
                isActive && "font-bold after:w-full"
              )}
            >
              <Link href={href} className="flex items-center gap-2">
                <Icon className=" w-3 h-3 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-base">{v.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
