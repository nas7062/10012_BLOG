"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { MyCombo } from "./MyCombo";

export function HeaderClient() {
  const { data: session } = useSession();

  return (
    <div className="ml-auto flex items-center gap-4 ">
      {!session?.user ? (
        <Link
          href={"/signin"}
          className="px-3  text-xs sm:text-base sm:px-4 py-2  rounded-2xl bg-gray-700 hover:bg-gray-900 text-white  cursor-pointer transition-all duration-200"
        >
          로그인
        </Link>
      ) : (
        <>
          <Link
            href={"/write"}
            className="md:block hidden px-3 py-1.5 text-sm rounded-2xl bg-green-400 border border-green-400 text-white cursor-pointer hover:bg-green-500 transition-all duration-200"
          >
            글 작성
          </Link>
          <LogoutButton />
          <MyCombo user={session.user} />
        </>
      )}
    </div>
  );
}
