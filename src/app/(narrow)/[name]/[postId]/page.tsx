import PostDetail from "@/src/app/_components/PostDetail";
import { Metadata } from "next";
import { getPostById } from "./_lib/getPostById";
import { getPostDetailData } from "./_lib/getPostDetailData";
import { auth } from "@/src/auth";

type RouteParams = {
  name: string;
  postId: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { name, postId } = await params;
  const numericPostId = Number(postId);

  let userName: string | undefined;

  if (!Number.isNaN(numericPostId)) {
    const result = await getPostById(numericPostId);
    userName = result?.title;
  }

  const decodedName = decodeURIComponent(name);
  const finalName = userName ?? decodedName ?? "사용자";

  return {
    title: `${finalName} | 10012`,
    description: `${finalName}님의 10012 정보 페이지입니다.`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const revalidate = 30;

export default async function Page({
  params,
}: {
  params: Promise<{ name: string; postId: string }>;
}) {
  const { name, postId } = await params;
  const numericPostId = Number(postId);
  const decodedName = decodeURIComponent(name);

  
  const session = await auth();
  const userEmail = session?.user?.email;

  // 서버에서 병렬로 모든 데이터 가져오기
  const initialData = await getPostDetailData(numericPostId, userEmail ?? '');

  return (
    <PostDetail
      name={decodedName}
      postId={postId}
      initialData={initialData}
    />
  );
}