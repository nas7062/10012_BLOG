"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import TagList from "./TagList";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { usePostLike } from "../hook/usePostLIke";
import Image from "next/image";
import { useModal } from "../provider/ModalProvider";
import { IPost } from "../type";

export default function SinglePost({ post }: { post: IPost }) {
  const router = useRouter();
  const { data: user } = useSession();
  const email = user?.user?.email as string;
  const { openModal } = useModal();
  const openLoginModal = () => openModal("LoginModal");
  const { liked, likeCount, toggle } = usePostLike(Number(post?.id), email);
  const handleToggleLike = () => {
    toggle(() => openLoginModal());
  };

  const MovePostDetail = (postId: number) => {
    router.push(`/${user?.user?.name}/${postId}`);
  };

  if (!post) return;
  return (
    <div
      className="flex flex-col w-full gap-4 pb-4  rounded-md cursor-pointer"
      onClick={() => MovePostDetail(post.id)}
      key={post.id}
    >
      <div>
        <Image
          src={post.coverImgUrl || "/nextImage.png"}
          alt={post.title}
          width={400}
          height={600}
          className="rounded-xl overflow-hidden  w-80 mx-auto "
        />
      </div>
      <div className="max-w-[740px] px-4 flex flex-col justify-around min-h-32 gap-4">
        <p className="text-xl text-primary font-semibold">{post.title}</p>
        <p className="whitespace-normal wrap-break-word line-clamp-5">
          {post.description}
        </p>
        <TagList tags={post.Tags || []} onDelete={() => {}} />
        <div className="flex gap-2 items-center">
          <p>{dayjs(new Date()).format("YYYY년 MM월 DD일")}</p>
          <p>{post.reppleCount}개의 댓글</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleToggleLike();
            }}
            className="cursor-pointer"
          >
            {liked ? (
              <Heart className="w-6 h-6 group-hover:fill-gray-500 fill-red-500" />
            ) : (
              <Heart className="w-6 h-6 group-hover:fill-red-500" />
            )}
          </button>
          <span>{likeCount}</span>
        </div>
      </div>
    </div>
  );
}
