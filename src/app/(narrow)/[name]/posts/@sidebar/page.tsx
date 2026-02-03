
import { getUserById } from "@/src/app/_lib/getUserById";
import { notFound } from "next/navigation";
import { getTagList } from "../_lib/getTagList";
import TagSidebarClient from "./_components/TagSidebarClient";


type TagRow = { Tags: string[] | null };

export default async function Sidebar({
  params,
}: {
  params: Promise<{ name: string; }>;
}) {
  const { name } = await params;
  const user = await getUserById(name);

  if (!user) {
    notFound();
  }

  const email = user.email;

  const rows: TagRow[] = await getTagList(email ?? '');

  const tagCountMap = new Map<string, number>();

  rows.forEach((row) => {
    const tags = row.Tags ?? [];
    tags.forEach((tag) => {
      tagCountMap.set(tag, (tagCountMap.get(tag) ?? 0) + 1);
    });
  });

  const tags = Array.from(tagCountMap.entries()).map(
    ([tag, count]) => ({ tag, count })
  );


  return (
    <div className="hidden lg:flex flex-col h-screen mt-96">
      <p className="text-lg font-semibold py-2 border-b-2 border-gray-200">
        태그 목록
      </p>

      <TagSidebarClient tags={tags} />
    </div>
  );
}
