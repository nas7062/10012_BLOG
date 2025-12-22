"use client";

import { useEffect, useRef } from "react";
import Post from "./Post";
import type { IPost } from "../(wide)/write/_components/WirtePageClient";
import { usePostList } from "../hook/usePostList";
import { SkeletonPost } from "./SkeletonPost";

type Props = {
  initialPosts: IPost[];
};

export default function PostListClient({ initialPosts }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = usePostList(initialPosts);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    console.error(error);
    return <div>게시물을 불러오는 데 실패했습니다.</div>;
  }

  const allPosts: IPost[] = data?.pages.flatMap((page) => page) ?? [];

  return (
    <>
      {isLoading && (
        <div className="grid max-[450px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="grid max-[450px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {allPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* 다음 페이지 트리거 */}
      <div ref={loadMoreRef} className="h-4" />

      {/*  다음 페이지 로딩 */}
      {isFetchingNextPage && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      )}

      {!hasNextPage && data.pages.length > 1 && !isLoading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          마지막 게시물입니다.
        </div>
      )}
    </>
  );
}
