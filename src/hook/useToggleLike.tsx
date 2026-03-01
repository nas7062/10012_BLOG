import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postToggleLike } from "../app/_lib/postToggleLike";

export function useToggleLike(userEmail: string, postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!userEmail) throw new Error("로그인이 필요합니다.");
      return postToggleLike(userEmail, postId);
    },
    onMutate: async () => {
      // 좋아요 상태 query 취소
      await queryClient.cancelQueries({
        queryKey: ["like", postId, userEmail],
      });

      // 이전 상태 저장
      const prevLiked = queryClient.getQueryData<boolean>([
        "like",
        postId,
        userEmail,
      ]);

      // 낙관적 업데이트: liked 토글
      queryClient.setQueryData<boolean | undefined>(
        ["like", postId, userEmail],
        (old) => !old
      );

      return { prevLiked };
    },
    onError: (_err, _variables, context) => {
      // 실패 시 롤백
      if (context?.prevLiked !== undefined) {
        queryClient.setQueryData(
          ["like", postId, userEmail],
          context.prevLiked
        );
      }
    },
    onSettled: () => {
      // 최종적으로 서버와 동기화
      queryClient.invalidateQueries({
        queryKey: ["like", postId, userEmail],
      });
    },
  });
}
