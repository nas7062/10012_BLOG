import { useQuery } from "@tanstack/react-query";
import { getFollowPosts } from "../app/_lib/getFollowPosts";
import { IPost } from "../types";

type UseFollowPostsResult = {
  posts: IPost[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export function useFollowPosts(id?: string): UseFollowPostsResult {
  const query = useQuery<IPost[] | null, Error>({
    queryKey: ["posts", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return [];
      const result = await getFollowPosts(id);
      return result ?? [];
    },
    staleTime: 1000 * 60,
  });
  return {
    posts: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
