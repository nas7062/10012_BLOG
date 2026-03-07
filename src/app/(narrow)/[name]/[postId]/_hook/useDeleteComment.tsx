import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../_lib/deleteComment";
import { toast } from "sonner";
import { IRepple } from "@/src/types";

type DeleteCommentInput = {
  id: number;
  postId: number;
};

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteCommentInput) => deleteComment(id),
    onSuccess: (_, variables) => {
      // 1) 캐시에서 바로 제거 (UI 즉시 반영)
      queryClient.setQueryData<IRepple[] | null>(
        ["comments", variables.postId],
        (prev) => (prev ? prev.filter((c) => c.id !== variables.id) : prev)
      );

      // 2) 서버 상태와 동기화용 refetch
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });

      toast.success("댓글 삭제 완료");
    },
    onError: () => {
      toast.error("댓글 삭제 실패");
    },
  });
}