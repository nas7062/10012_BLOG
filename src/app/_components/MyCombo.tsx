"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import { useCurrentUser } from "../hook/useCurrentUser";
import { useState } from "react";
import UserImage from "./UserImage";

export function MyCombo({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const email = user?.email as string;
  const {
    user: userData,
    isLoading: isUserLoading,
    isError,
  } = useCurrentUser({ email });
  const id = userData?.id;
  const frameworks = [
    {
      href: `/${id}/posts`,
      label: "나의 글",
    },
    {
      href: "/setting",
      label: "설정",
    },
    {
      href: "/write",
      label: "새 글 작성",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="추가 옵션 버튼"
        >
          <UserImage
            src={userData?.image ? userData.image : "/hello.png"}
            alt="프로필 이미지"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-20 p-0">
        <Command>
          <CommandList>
            <CommandGroup className="p-0!">
              <div className="flex flex-col text-center ">
                {frameworks.map((framework) => {
                  if (framework.label === "새 글 작성") {
                    return (
                      <Link
                        href={framework.href}
                        key={framework.label}
                        className="block md:hidden cursor-pointer border-b py-2 bg-gray-300 hover:bg-gray-400 text-primary text-sm"
                      >
                        {framework.label}
                      </Link>
                    );
                  } else
                    return (
                      <Link
                        href={framework.href}
                        key={framework.label}
                        className="cursor-pointer border-b  bg-gray-300 hover:bg-gray-400 py-2 text-sm"
                      >
                        {framework.label}
                      </Link>
                    );
                })}
                <button
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="block md:hidden py-2 bg-gray-300 text-sm hover:bg-gray-400 cursor-pointer transition-all duration-200"
                >
                  로그아웃
                </button>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
