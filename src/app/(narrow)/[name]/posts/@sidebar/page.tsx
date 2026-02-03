"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/src/app/hook/useCurrentUser";
import { useTagList } from "../_hook/useTagList";
import { Spinner } from "@/components/ui/spinner";
export type TagRow = { Tags: string[] | null };

export default function Sidebar() {
  const id = usePathname().split("/")[1];
  const router = useRouter();
  const pathname = usePathname();

  const { user: userData, isLoading: isUserLoading } = useCurrentUser({
    id,
  });
  const email = userData?.email as string;
  const { Tags, isLoading: isTagsLoading } = useTagList(email);
  const tagList = new Map<string, number>();

  const selectTag = (tag: string) => {
    router.push(`${pathname}?tag=${tag}`);
  };
  if (!Tags) return;
  Tags.forEach((row) => {
    const tagrow = row.Tags ?? [];
    tagrow.forEach((tag: string) => {
      const prev = tagList.get(tag) ?? 0;
      tagList.set(tag, prev + 1);
    });
  });
  if (isUserLoading || isTagsLoading) return <Spinner className="size-6 text-green-500" />;;

  return (
    <div className="hidden lg:flex flex-col  h-screen mt-96  ">
      <p className="text-lg font-semibold py-2 border-b-2 border-gray-200">
        태그 목록
      </p>
      <div className="flex flex-col gap-2">
        {Array.from(tagList.entries()).map(([tag, count]) => (
          <div key={tag} className="flex gap-2">
            <span
              onClick={() => selectTag(tag)}
              className="cursor-pointer hover:text-gray-500"
            >
              {tag}
            </span>
            <span>({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
