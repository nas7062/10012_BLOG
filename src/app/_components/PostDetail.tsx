"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import Viewer from "../(wide)/write/_components/View";
import { useSession } from "next-auth/react";
import ReppleForm from "../(narrow)/[name]/[postId]/_components/ReppleForm";
import ReppleList from "../(narrow)/[name]/[postId]/_components/ReppleList";
import { Heart } from "lucide-react";
import LoginModal from "./LoginModal";
import clsx from "clsx";
import { usePostAuthor } from "../hook/usePostAuthor";
import { usePostById } from "../hook/usePostById";
import { useCurrentUser } from "../hook/useCurrentUser";
import { usePostLike } from "../hook/usePostLIke";
import { useGetComment } from "../hook/useGetComment";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteComment } from "../(narrow)/[name]/[postId]/_hook/useDeleteComment";
import { FollowButton } from "./FollowButton";
import DeletePostModal from "../(narrow)/[name]/posts/_components/DeletePostModal";
import { useDeletePost } from "../(narrow)/[name]/posts/_hook/useDeletePost";
import { useModal } from "../provider/ModalProvider";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export interface IUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  provider: string | null;
  created_at: string | null;
  like?: number[] | null;
  descript?: string | null;
  github?: string | null;
}

export interface IRepple {
  id: number;
  postId: number | null;
  content: string | null;
  name: string | null;
  userid?: string | null;
  createdAt: string;
  updatedat?: string | null;
}

export default function PostDetail({
  name,
  postId,
}: {
  name: string;
  postId: string;
}) {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const openLoginModal = () => openModal("LoginModal");

  const { data: session } = useSession();
  const { data: writeUser, isLoading: isAuthorLoading } = usePostAuthor(
    Number(postId)
  );

  const { data: post, isLoading: isPostLoading } = usePostById(Number(postId));
  const email = session?.user?.email ?? "";

  // 좋아요 상태 조회
  const { liked, likeCount, toggle } = usePostLike(Number(post?.id), email);
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
  const handleToggleLike = () => {
    toggle(() => openLoginModal());
  };

  const isUpdate = post?.email === session?.user?.email;

  if (isAuthorLoading || isPostLoading || isUserLoading || isReppleLoading)
    return "loading...";
  if (isError) return;
  if (!writeUser?.id) return;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-semibold py-4">{post?.title}</h2>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <p className="font-semibold">{writeUser?.name || "글쓴이"}</p>
            <p>{dayjs(post?.updatedAt).format("YYYY년 MM월 DD일")}</p>
          </div>
          {isUpdate ? (
            <div className="flex gap-2">
              <p
                className="cursor-pointer text-gray-500 hover:text-green-500"
                onClick={() => router.push(`/write?id=${postId}`)}
              >
                수정
              </p>
              <p
                className="cursor-pointer text-gray-500 hover:text-red-500"
                onClick={openDeletePostModal}
              >
                삭제
              </p>
            </div>
          ) : (
            <div className="flex gap-1">
              <FollowButton userId={user?.id} targetId={writeUser.id} />
              <button
                onClick={handleToggleLike}
                className="flex gap-1 border border-gray-300 px-2 py-1 rounded-lg lg:hidden"
              >
                <Heart
                  className={clsx(
                    liked
                      ? "text-rose-500 fill-rose-500"
                      : "text-gray-500 fill-transparent"
                  )}
                  fill={liked ? "currentColor" : "none"}
                  strokeWidth={liked ? 1.75 : 2}
                />
                <p>{likeCount}</p>
              </button>
            </div>
          )}
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
