"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/" })}
      className="hidden md:block px-3 py-1.5 text-sm  rounded-2xl bg-gray-700 hover:bg-gray-900 text-white  cursor-pointer transition-all duration-200"
    >
      로그아웃
    </button>
  );
}
