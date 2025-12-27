"use client";
import { useRouter } from "next/navigation";
import React, { memo, useCallback } from "react";
import { usePostAuthor } from "../hook/usePostAuthor";
import { SkeletonPost } from "./SkeletonPost";
import PostImage from "./PostImage";
import { PostContent } from "./PostContent";
import { IPost } from "../type";

function Post({ post, priority }: { post: IPost; priority?: boolean }) {
  const router = useRouter();
  const { data: writeUser, isError } = usePostAuthor(post.id);

  const MovePostDetail = useCallback(
    (postId: number) => {
      if (!writeUser) return;
      router.push(`/${writeUser?.name}/${postId}`);
    },
    [writeUser, router]
  );

  const MoveUserPosts = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!writeUser) return;
      router.push(`/${writeUser?.id}/posts`);
    },
    [writeUser, router]
  );

  if (!post) {
    return Array.from({ length: 5 }).map((_, i) => <SkeletonPost key={i} />);
  }

  // writeUser 로딩 중이거나 에러일 때도 동일한 레이아웃 공간 유지
  const isLoadingUser = !writeUser && !isError;

  return (
    <div
      className="flex flex-col max-w-[330px] w-full h-[420px] shadow-xl gap-2 pb-4 rounded-md
                transition-transform duration-350
                hover:-translate-y-2 hover:shadow-2xl
                cursor-pointer relative overflow-hidden"
    >
      <div
        className="relative w-full h-[240px] shrink-0"
        onClick={() => {
          if (writeUser) MovePostDetail(post.id);
        }}
      >
        <PostImage
          src={post.coverImgUrl}
          alt={post.title}
          priority={priority}
        />
      </div>
      <div
        className="px-4 flex flex-col flex-1 justify-between min-h-[180px]"
        onClick={() => {
          if (writeUser) MovePostDetail(post.id);
        }}
      >
        {isLoadingUser || isError ? (
          <div className="flex flex-col gap-2 h-[420px] justify-between">
            <div className="flex flex-col gap-2 shrink-0">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-12 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex justify-between text-xs shrink-0">
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
              <div className="h-4 bg-muted animate-pulse rounded w-20" />
            </div>
            <div className="flex items-center justify-between gap-2 mt-auto shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-24" />
              </div>
            </div>
          </div>
        ) : writeUser ? (
          <PostContent
            post={post}
            writeUser={writeUser}
            MoveUserPosts={MoveUserPosts}
          />
        ) : null}
      </div>
    </div>
  );
}

export default memo(Post);
