import { useQuery } from "@tanstack/react-query";
import { getToggleLike } from "../app/_lib/getToggleLike";

export const useLike = (postId: number, email?: string) => {
  return useQuery({
    queryKey: ["like", postId, email],
    queryFn: () => {
      if (!postId || !email)
        return Promise.resolve({ liked: false, likeCount: 0 });
      return getToggleLike(postId, email);
    },
    enabled: !!postId && !!email,
  });
};
