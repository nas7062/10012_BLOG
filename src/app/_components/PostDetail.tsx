"use client";

import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import Viewer from "../(wide)/write/_components/View";
import { useSession } from "next-auth/react";
import ReppleForm from "../(narrow)/[name]/[postId]/_components/ReppleForm";
import ReppleList from "../(narrow)/[name]/[postId]/_components/ReppleList";
import { usePostAuthor } from "../hook/usePostAuthor";
import { usePostById } from "../hook/usePostById";
import { useCurrentUser } from "../hook/useCurrentUser";
import { useGetComment } from "../hook/useGetComment";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteComment } from "../(narrow)/[name]/[postId]/_hook/useDeleteComment";
import { useDeletePost } from "../(narrow)/[name]/posts/_hook/useDeletePost";
import { useModal } from "../provider/ModalProvider";
import { IRepple } from "../type";
import { Spinner } from "@/components/ui/spinner";
import { UpdateOrHeart } from "./UpdateOrHeart";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export default function PostDetail({
  name,
  postId,
}: {
  name: string;
  postId: string;
}) {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const { data: session } = useSession();
  const { data: writeUser, isLoading: isAuthorLoading } = usePostAuthor(
    Number(postId)
  );

  const { data: post, isLoading: isPostLoading } = usePostById(Number(postId));
  const email = session?.user?.email ?? "";

  // 좋아요 상태 조회

  const { user, isLoading: isUserLoading, isError } = useCurrentUser({ email });
  const { comments, isLoading: isReppleLoading } = useGetComment(
    Number(post?.id)
  );

  const queryClient = useQueryClient();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    deletePost({ id: Number(postId) });
    closeModal();
    router.replace("/");
  };

  const handleDeleteComment = (commentId: number) => {
    deleteComment({ id: commentId, postId: Number(postId) });
    closeModal();
  };

  const openDeletePostModal = () => {
    openModal("DeletePost", {
      onDelete: handleDeletePost,
      postId: Number(postId),
    });
  };

  const openDeleteCommentModal = (commentId: number) => {
    openModal("DeleteComment", {
      onDelete: () => handleDeleteComment(commentId),
      commentId,
      postId: Number(postId),
    });
  };

  const isUpdate = post?.email === session?.user?.email;

  if (isAuthorLoading || isPostLoading || isUserLoading || isReppleLoading)
    return <Spinner className="size-6 text-green-500" />;
  if (isError || !writeUser?.id) return;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-semibold py-4">{post?.title}</h2>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <p className="font-semibold">{writeUser?.name || "글쓴이"}</p>
            <p>{dayjs(post?.updatedAt).format("YYYY년 MM월 DD일")}</p>
          </div>
          <UpdateOrHeart
            isUpdate={isUpdate}
            openDeletePostModal={openDeletePostModal}
            postId={postId}
            user={user}
            writeUser={writeUser}
          />
        </div>
        <div
          className="wmde-markdown wmde-markdown-color
                 bg-background text-foreground"
        >
          <Viewer content={post?.description || ""} />
        </div>
      </div>

      <ReppleForm
        user={user}
        postId={postId}
        reppleCount={comments?.length}
        onCreated={(newRepple: IRepple) => {
          queryClient.setQueryData<IRepple[] | undefined>(
            ["comments", Number(post?.id)],
            (prev) => (prev ? [newRepple, ...prev] : [newRepple])
          );
        }}
      />
      <ReppleList
        repples={comments}
        user={user}
        postId={postId}
        onDelete={openDeleteCommentModal}
      />
    </div>
  );
}
