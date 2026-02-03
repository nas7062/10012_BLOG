"use client";

import { useRouter, usePathname } from "next/navigation";

type TagItem = {
  tag: string;
  count: number;
};

export default function TagSidebarClient({
  tags,
}: {
  tags: TagItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const selectTag = (tag: string) => {
    router.push(`${pathname}?tag=${tag}`);
  };

  return (
    <div className="flex flex-col gap-2">
      {tags.map(({ tag, count }) => (
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
  );
}
