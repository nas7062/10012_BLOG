import { useQuery } from "@tanstack/react-query";
import { getLikePosts } from "../_lib/getLikePosts";
import { IPost } from "../type";

type UseLikePostsResult = {
  posts: IPost[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export function useLikePosts(email?: string): UseLikePostsResult {
  const query = useQuery<IPost[] | null, Error>({
    queryKey: ["posts", email],
    enabled: !!email,
    queryFn: async () => {
      if (!email) return [];
      const result = await getLikePosts(email);
      return result ?? [];
    },
    staleTime: 1000 * 60, // 1분 동안 fresh
  });
  return {
    posts: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
