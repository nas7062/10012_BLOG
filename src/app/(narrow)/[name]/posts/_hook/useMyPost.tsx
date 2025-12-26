import { useQuery } from "@tanstack/react-query";
import { getMyPost } from "@/src/app/_lib/getMyPosts";
import { IPost } from "@/src/app/type";

type UseCurrentUserResult = {
  posts: IPost[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export function useMyPost(email?: string, tag?: string): UseCurrentUserResult {
  const query = useQuery<IPost[] | null, Error>({
    queryKey: ["posts", email, tag],
    enabled: !!email,
    queryFn: async () => {
      if (!email) return [];
      const result = await getMyPost(email, tag);
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
