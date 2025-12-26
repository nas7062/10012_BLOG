"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchPost, SEARCH_PAGE_SIZE } from "../_lib/getSearchPost";
import { IPost } from "../type";

export function useSearchPost(q: string) {
  return useInfiniteQuery<IPost[], Error>({
    queryKey: ["searchPosts", q],
    enabled: !!q,
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getSearchPost({
        q,
        page: pageParam as number,
        pageSize: SEARCH_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < SEARCH_PAGE_SIZE) return undefined; // 마지막 페이지
      return allPages.length; // 다음 page 번호
    },
  });
}
