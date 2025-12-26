import dayjs from "dayjs";
import { IPost } from "../(wide)/write/_components/WirtePageClient";
import Image from "next/image";
import { IUser } from "./PostDetail";
import React from "react";
import PostActions from "./PostActions";

interface PostContentProps {
  post: IPost;
  writeUser: IUser | null;
  MoveUserPosts: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function PostContent({
  post,
  writeUser,
  MoveUserPosts,
}: PostContentProps) {
  return (
    <div className="gap-2 flex flex-col ">
      <p className="text-lg text-primary font-semibold ">{post.title}</p>
      <p className="whitespace-normal text-sm h-[58px] wrap-break-word line-clamp-3">
        {post.description}
      </p>
      <div className="flex justify-between text-xs">
        <p>{dayjs(post.createdAt).format("YYYY년 MM월 DD일")}</p>
        <p>{post.reppleCount}개의 댓글</p>
      </div>

      <div className="flex  items-center justify-between gap-2  mt-auto">
        <div className="flex items-center gap-2" onClick={MoveUserPosts}>
          <Image
            src={writeUser?.image ? writeUser?.image : "/nextImage.png"}
            width={40}
            height={40}
            alt="프로필 이미지"
            className="rounded-full w-10 h-10"
          />
          <p className="font-semibold text-sm">
            by {writeUser?.name || "글쓴이"}
          </p>
        </div>
        <PostActions postId={post.id} />
      </div>
    </div>
  );
}
