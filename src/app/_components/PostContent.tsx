import dayjs from "dayjs";
import React from "react";
import PostActions from "./PostActions";
import UserImage from "./UserImage";
import { IPost, IUser } from "../type";

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
    <div className="gap-2 flex flex-col h-full">
      <div className="flex flex-col gap-2 shrink-0">
        <p className="text-lg text-primary font-semibold line-clamp-2 min-h-2">
          {post.title}
        </p>
        <p className="whitespace-normal text-sm h-[60px] wrap-break-word line-clamp-3 overflow-hidden">
          {post.description || ""}
        </p>
      </div>
      <div className="flex justify-between text-xs shrink-0">
        <p>{dayjs(post.createdAt).format("YYYY년 MM월 DD일")}</p>
        <p>{post.reppleCount}개의 댓글</p>
      </div>

      <div className="flex items-center justify-between gap-2 mb-auto shrink-0">
        <div className="flex items-center gap-2" onClick={MoveUserPosts}>
          <UserImage
            src={writeUser?.image ? writeUser?.image : "/nextImage.png"}
            alt="프로필 이미지"
            priority={true}
          />
          <p className="font-semibold text-sm truncate max-w-[120px]">
            by {writeUser?.name || "글쓴이"}
          </p>
        </div>
        <PostActions postId={post.id} />
      </div>
    </div>
  );
}
