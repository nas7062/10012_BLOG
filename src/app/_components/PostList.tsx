"use client";

import { useEffect, useRef } from "react";
import Post from "./Post";
import { usePostList } from "../hook/usePostList";
import { SkeletonPost } from "./SkeletonPost";
import { IPost } from "../type";

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "0px 0px -100px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    console.error(error);
    return <div>게시물을 불러오는 데 실패했습니다.</div>;
  }

  const allPosts: IPost[] = data?.pages.flatMap((page) => page) ?? [];
  const hasPosts = allPosts.length > 0;
  return (
    <>
      {!hasPosts && (
        <div className="grid max-[450px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      )}

      {hasPosts && (
        <div className="grid max-[450px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {allPosts.map((post, idx) => (
            <Post key={post.id} post={post} priority={idx ===0} />
          ))}
        </div>
      )}

      {/*  다음 페이지 로딩 */}
      {isFetchingNextPage && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      )}
      {/* 다음 페이지 트리거 */}
      <div ref={loadMoreRef} className="h-32" />

      {!hasNextPage && data.pages.length > 1 && !isLoading && (
        <div className=" text-center text-sm text-gray-500">
          더이상 게시물이 없습니다.
        </div>
      )}
    </>
  );
}
