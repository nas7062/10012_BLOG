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
import { useEffect, useRef, useState } from "react";
import UserImage from "../UserImage";
import { useCurrentUser } from "../../../hook/useCurrentUser";

export function MyCombo({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const email = user?.email as string;
  const { user: userData } = useCurrentUser({ email });
  const id = userData?.id;

  const firstLinkRef = useRef<HTMLAnchorElement>(null);
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

  // Popover가 열릴 때 첫 번째 링크에 포커스
  useEffect(() => {
    if (open && firstLinkRef.current) {
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label={`${userData?.name || "사용자"} 메뉴 열기`}
          aria-haspopup="menu"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(!open);
            }
          }}
        >
          <UserImage
            src={userData?.image ? userData.image : "/hello.png"}
            alt="프로필 이미지"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-20 p-0"
        onKeyDown={handleKeyDown}
        role="menu"
        aria-label="사용자 메뉴"
      >
        <Command>
          <CommandList>
            <CommandGroup className="p-0!">
              <div className="flex flex-col text-center ">
                {frameworks.map((framework, index) => {
                  if (framework.label === "새 글 작성") {
                    return (
                      <Link
                        href={framework.href}
                        ref={index === 0 ? firstLinkRef : null}
                        key={framework.label}
                        aria-label={framework.label}
                        onClick={() => setOpen(false)}
                        tabIndex={0}
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
                        onClick={() => setOpen(false)}
                        aria-label={framework.label}
                        tabIndex={0}
                        className="cursor-pointer border-b  bg-gray-300 hover:bg-gray-400 py-2 text-sm"
                      >
                        {framework.label}
                      </Link>
                    );
                })}
                <button
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="block md:hidden py-2 bg-gray-300 text-sm hover:bg-gray-400 cursor-pointer transition-all duration-200"
                  aria-label="로그아웃"
                  tabIndex={0}
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
