"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchPost } from "../hook/useSearchPost";
import SinglePostList from "./SinglePostList";
import { IPost } from "../type";

type SortType = "relevance" | "latest";

export default function SearchResultList({ q }: { q: string }) {
  const [sortType, setSortType] = useState<SortType>("relevance");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useSearchPost(q);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!hasNextPage) return;

    const target = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!q) {
    return (
      <div className="text-slate-400 text-center">검색어를 입력해주세요.</div>
    );
  }

  if (status === "pending") {
    return <div className="text-center">검색 중...</div>;
  }

  if (status === "error") {
    console.error(error);
    return <div className="text-center">검색 중 오류가 발생했습니다.</div>;
  }

  const allPosts: IPost[] = data?.pages.flatMap((page) => page) ?? [];
  const totalCount = allPosts.length; // 지금은 로드된 개수 기준

  // 정렬 탭 UI만 먼저 구현 (실제 정렬 로직은 나중에 붙여도 됨)
  const sortedPosts = allPosts; // 정렬 로직 추가 시 여기서 정렬

  return (
    <>
      {/* 총 N건 문구 */}
      <div className="flex justify-center">
        <h3 className="text-lg! sm:text-2xl! text-gray-500">
          총
          <strong className="text-green-500 text-xl! sm:text-3xl!">
            {totalCount}
          </strong>
          건의 포스트를 찾았습니다.
        </h3>
      </div>

      {/* 정렬 탭 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSortType("relevance")}
          className={`border-r border-r-gray-300 pr-2 cursor-pointer ${
            sortType === "relevance"
              ? "font-semibold  text-primary"
              : "text-gray-400"
          }`}
        >
          정확도순
        </button>
        <button
          type="button"
          onClick={() => setSortType("latest")}
          className={`cursor-pointer ${
            sortType === "latest"
              ? "font-semibold text-primary"
              : "text-gray-400"
          }`}
        >
          최신순
        </button>
      </div>

      {/* 실제 카드 리스트 (velog처럼 크게 하나씩) */}
      <SinglePostList posts={sortedPosts} />

      {/* 인피니트 스크롤 트리거 */}
      <div ref={loadMoreRef} className="h-6" />

      {isFetchingNextPage && (
        <div className="mt-4 text-center text-sm">더 불러오는 중...</div>
      )}

      {!hasNextPage && totalCount > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          검색 결과의 마지막입니다.
        </div>
      )}
    </>
  );
}
