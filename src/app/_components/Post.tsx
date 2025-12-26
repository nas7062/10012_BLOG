"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { IPost } from "../(wide)/write/_components/WirtePageClient";
import { usePostAuthor } from "../hook/usePostAuthor";
import { SkeletonPost } from "./SkeletonPost";
import PostImage from "./PostImage";
import { PostContent } from "./PostContent";

export default function Post({ post }: { post: IPost }) {
  const router = useRouter();
  const { data: writeUser, isError } = usePostAuthor(post.id);

  const MovePostDetail = (postId: number) => {
    if (!writeUser) return;
    router.push(`/${writeUser?.name}/${postId}`);
  };

  const MoveUserPosts = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!writeUser) return;
    router.push(`/${writeUser?.id}/posts`);
  };

  if (!post) {
    return Array.from({ length: 5 }).map((_, i) => <SkeletonPost key={i} />);
  }

  if (!writeUser || isError) return;
  return (
    <div
      className="flex flex-col max-w-[300px] shadow-xl gap-2 pb-4 rounded-md
                transition-transform duration-350
                hover:-translate-y-2 hover:shadow-2xl
                cursor-pointer relative"
    >
      <div
        onClick={() => {
          MovePostDetail(post.id);
        }}
      >
        <PostImage src={post.coverImgUrl} alt={post.title} />
      </div>
      <div
        className="max-w-[330px] px-4 flex flex-col justify-around h-32 mt-auto"
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
