import dayjs from "dayjs";

import { UpdateOrHeart } from "../UpdateOrHeart";
import { IUser } from "../../type";

interface PostHeaderProps {
  title: string;
  author: IUser;
  updatedAt: string;
  isUpdate: boolean;
  postId: string;
  currentUser: IUser | null;
  onDeletePost: () => void;
}

export function PostHeader({
  title,
  author,
  updatedAt,
  isUpdate,
  postId,
  currentUser,
  onDeletePost,
}: PostHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-4xl font-semibold py-4">{title}</h2>
      <div className="flex justify-between">
        <div className="flex gap-1 sm:gap-2">
          <p className="font-semibold sm:text-base text-xs">
            {author.name || "글쓴이"}
          </p>
          <p className=" sm:text-base text-xs">
            {dayjs(updatedAt).format("YYYY년 MM월 DD일")}
          </p>
        </div>
        <UpdateOrHeart
          isUpdate={isUpdate}
          openDeletePostModal={onDeletePost}
          postId={postId}
          user={currentUser}
          writeUser={author}
        />
      </div>
    </div>
  );
}
