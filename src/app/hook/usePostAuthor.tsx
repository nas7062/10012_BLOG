import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getPostUser } from "../_lib/getPostUser"; // 경로는 프로젝트에 맞게 조정
import { IUser } from "../type";

export function usePostAuthor(
  postId?: number
): UseQueryResult<IUser | null, Error> {
  return useQuery<IUser | null, Error>({
    queryKey: ["postAuthor", postId],
    enabled: !!postId, // postId 없으면 요청 X
    queryFn: async () => {
      if (!postId) return null;
      const result = await getPostUser(postId);
      return result?.user ?? null;
    },
    staleTime: 1000 * 60, // 1분 동안 fresh
  });
}
