"use client";
import { Heart } from "lucide-react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { IPost } from "../(wide)/write/_components/WirtePageClient";
import Image from "next/image";
import { usePostAuthor } from "../hook/usePostAuthor";
import { usePostLike } from "../hook/usePostLIke";
import { useModal } from "../provider/ModalProvider";
import { SkeletonPost } from "./SkeletonPost";

export default function Post({ post }: { post: IPost }) {
  const router = useRouter();
  const { data: user } = useSession();
  const email = user?.user?.email as string;
  const {
    data: writeUser,
    isLoading: isAuthorLoading,
    isError,
  } = usePostAuthor(post.id);
  const { openModal } = useModal();
  const openLoginModal = () => openModal("LoginModal");
  const { liked, likeCount, toggle } = usePostLike(post.id, email);

  const handleToggleLike = () => {
    toggle(() => openLoginModal());
  };

  const MovePostDetail = (postId: number) => {
    if (!writeUser) return;
    router.push(`/${writeUser?.name}/${postId}`);
  };

  const MoveUserPosts = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!writeUser) return;
    router.push(`/${writeUser?.id}/posts`);
  };

  if (isAuthorLoading) {
    return <SkeletonPost />;
  }

  if (!writeUser || isError) return;
  return (
    <div
      className="flex flex-col max-w-[350px] shadow-xl gap-2 pb-4 rounded-md
                transition-transform duration-350
                hover:-translate-y-2 hover:shadow-2xl
                cursor-pointer relative"
    >
      <div
        onClick={() => {
          MovePostDetail(post.id);
        }}
      >
        <Image
          src={post.coverImgUrl ? post.coverImgUrl : "/noImage.jpg"}
          alt={post.title}
          width={350}
          height={200}
          className="rounded-md max-h-60 aspect-square"
        />
      </div>
      <div
        className="max-w-[330px] px-4 flex flex-col justify-around h-32 mt-auto"
        onClick={() => {
          MovePostDetail(post.id);
        }}
      >
        <p className="text-lg text-primary font-semibold">{post.title}</p>
        <p className="whitespace-normal text-sm wrap-break-word line-clamp-3">
          {post.description}
        </p>
        <div className="flex justify-between text-xs">
          <p>{dayjs(post.createdAt).format("YYYY년 MM월 DD일")}</p>
          <p>{post.reppleCount}개의 댓글</p>
        </div>
      </div>
      <div className="flex  items-center gap-2 px-4 mt-auto">
        <div className="flex items-center gap-2" onClick={MoveUserPosts}>
          <Image
            src={writeUser?.image ? writeUser?.image : "/nextImage.png"}
            width={50}
            height={50}
            alt="프로필 이미지"
            className="rounded-full w-10 h-10"
          />
          <p className="font-semibold text-sm">
            by {writeUser?.name || "글쓴이"}
          </p>
        </div>

        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleToggleLike();
            }}
            className="cursor-pointer"
          >
            <Heart
              size={22}
              className={
                liked
                  ? "text-rose-500 fill-rose-500"
                  : "text-gray-500 fill-transparent"
              }
              fill={liked ? "currentColor" : "none"}
              strokeWidth={liked ? 1.75 : 2}
            />
          </button>
          <p>{likeCount}</p>
        </div>
      </div>
    </div>
  );
}
