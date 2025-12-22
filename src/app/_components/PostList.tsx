"use client";

import { useEffect, useRef } from "react";
import Post from "./Post";
import type { IPost } from "../(wide)/write/_components/WirtePageClient";
import { usePostList } from "../hook/usePostList";
type Props = {
  initialPosts: IPost[];
};
export default function PostListClient({ initialPosts }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = usePostList(initialPosts);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "error") {
    console.error(error);
    return <div>게시물을 불러오는 데 실패했습니다.</div>;
  }

  const allPosts: IPost[] = data?.pages.flatMap((page) => page) ?? [];

  return (
    <>
      <div className="grid   max-[450px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
        {allPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {/* 이 div가 화면에 보이면 다음 페이지 요청 */}
      <div ref={loadMoreRef} className="h-4" />

      {isFetchingNextPage && (
        <div className="mt-4 text-center text-sm">더 불러오는 중...</div>
      )}

      {!hasNextPage && (
        <div className="mt-4 text-center text-sm text-gray-500">
          마지막 게시물입니다.
        </div>
      )}
    </>
  );
}
