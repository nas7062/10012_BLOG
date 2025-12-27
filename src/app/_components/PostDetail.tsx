"use client";

import { useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ReppleForm from "../(narrow)/[name]/[postId]/_components/ReppleForm";
import ReppleList from "../(narrow)/[name]/[postId]/_components/ReppleList";
import { useDeleteComment } from "../(narrow)/[name]/[postId]/_hook/useDeleteComment";
import { useDeletePost } from "../(narrow)/[name]/posts/_hook/useDeletePost";
import { useModal } from "../provider/ModalProvider";
import { IRepple } from "../type";
import { PostHeader } from "./PostDetail/PostHeader";
import { PostBody } from "./PostDetail/PostBody";
import { PostDetailSkeleton } from "./PostDetail/PostDetailSkeleton";
import { usePostDetailData } from "./PostDetail/usePostDetailData";

interface PostDetailProps {
  name: string;
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();

  const numericPostId = Number(postId);
  const { writeUser, post, user, comments, isLoading, isError, isUpdate } =
    usePostDetailData(numericPostId);

  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = useCallback(() => {
    deletePost({ id: numericPostId });
    closeModal();
    router.replace("/");
  }, [deletePost, closeModal, router, numericPostId]);

  const handleDeleteComment = useCallback(
    (commentId: number) => {
      deleteComment({ id: commentId, postId: numericPostId });
      closeModal();
    },
    [deleteComment, closeModal, numericPostId]
  );

  const openDeletePostModal = useCallback(() => {
    openModal("DeletePost", {
      onDelete: handleDeletePost,
      postId: numericPostId,
    });
  }, [openModal, handleDeletePost, numericPostId]);

  const openDeleteCommentModal = useCallback(
    (commentId: number) => {
      openModal("DeleteComment", {
        onDelete: () => handleDeleteComment(commentId),
        commentId,
        postId: numericPostId,
      });
    },
    [openModal, handleDeleteComment, numericPostId]
  );

  const postIdForComments = post?.id;
  const handleCommentCreated = useCallback(
    (newRepple: IRepple) => {
      if (!postIdForComments) return;
      queryClient.setQueryData<IRepple[] | undefined>(
        ["comments", postIdForComments],
        (prev) => (prev ? [newRepple, ...prev] : [newRepple])
      );
    },
    [queryClient, postIdForComments]
  );

  const commentCount = useMemo(() => comments?.length ?? 0, [comments?.length]);

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (isError || !writeUser?.id || !post) {
    return (
      <div className="text-center text-red-500 py-10">
        게시글을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <PostHeader
          title={post.title}
          author={writeUser}
          updatedAt={post.updatedAt}
          isUpdate={isUpdate}
          postId={postId}
          currentUser={user}
          onDeletePost={openDeletePostModal}
        />
        <PostBody content={post.description || ""} />
      </div>

      <ReppleForm
        user={user}
        postId={postId}
        reppleCount={commentCount}
        onCreated={handleCommentCreated}
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
