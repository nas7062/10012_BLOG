import { Suspense } from "react";
import type { Metadata } from "next";
import PostClient from "./_components/PostsClient";
import { getUserById } from "@/src/app/_lib/getUserById";
import { Spinner } from "@/components/ui/spinner";

type RouteParams = {
  name: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { name } = await params;

  const user = await getUserById(name);
  const userName = user?.name ?? "사용자";

  return {
    title: `${userName}님의 글 | 10012`,
    description: `${userName}님의 10012 작성한 글 페이지입니다.`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const revalidate = 0;

export default function PostPage() {
  return (
    <Suspense
      fallback={
        <main>
          <Spinner className="size-6 text-green-500" />
        </main>
      }
    >
      <PostClient />
    </Suspense>
  );
}
