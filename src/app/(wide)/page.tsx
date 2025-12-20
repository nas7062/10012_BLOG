import { Metadata } from "next";
import { getPostListServer } from "../_lib/getPostList.server";
import PostListClient from "../_components/PostList";

export const metadata: Metadata = {
  title: "10012 | 정보 공유 플랫폼",
  description:
    "10012는 개발, 일상, 인사이트 등 다양한 주제를 자유롭게 공유하고 기록하는 정보 공유 블로그 플랫폼입니다.",
  keywords: ["10012", "블로그", "공유", "정보", "지식", "개발"],
  openGraph: {
    title: "정보 공유 플랫폼",
    description:
      "개발부터 일상까지, 나만의 글을 남기고 다른 사람들의 인사이트를 발견하는 10012 정보 공유 블로그 플랫폼.",
    type: "website",
  },
};

export const revalidate = 30;

export default async function Home() {
  const initialPosts = await getPostListServer();
  console.log(initialPosts);
  return (
    <main>
      <PostListClient initialPosts={initialPosts} />
    </main>
  );
}
