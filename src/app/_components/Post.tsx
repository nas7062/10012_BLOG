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

  if (!writeUser || isError) return;
  return (
    <div
      className="flex flex-col max-w-[330px] w-full min-h-[420px] shadow-xl gap-2 pb-4 rounded-md
                transition-transform duration-350
                hover:-translate-y-2 hover:shadow-2xl
                cursor-pointer relative overflow-hidden"
    >
      <div
        className="relative w-full h-[240px] shrink-0"
        onClick={() => {
          MovePostDetail(post.id);
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
          MovePostDetail(post.id);
        }}
      >
        <PostContent
          post={post}
          writeUser={writeUser}
          MoveUserPosts={MoveUserPosts}
        />
      </div>
    </div>
  );
}

export default memo(Post);
