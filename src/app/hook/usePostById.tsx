import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getPostById } from "../(narrow)/[name]/[postId]/_lib/getPostById";
import { IPost } from "../type";

export function usePostById(
  postId?: number
): UseQueryResult<IPost | null, Error> {
  return useQuery<IPost | null, Error>({
    queryKey: ["posts", postId],
    enabled: !!postId,
    queryFn: async () => {
      if (!postId) return null;
      const data = await getPostById(postId);
      return data ?? null;
    },
    staleTime: 1000 * 60, // 1분 동안 fresh
  });
}
