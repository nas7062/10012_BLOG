"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useModal } from "../provider/ModalProvider";
import { usePostLike } from "../hook/usePostLIke";

export default function PostActions({ postId }: { postId: number }) {
  const { data: user } = useSession();
  const email = user?.user?.email as string;
  const { liked, likeCount, toggle } = usePostLike(postId, email);
  const { openModal } = useModal();

  const handleToggle = () => {
    toggle(() => openModal("LoginModal"));
  };

  return (
    <div
      className="flex gap-1 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <button
        onClick={handleToggle}
        className="cursor-pointer"
        aria-label="좋아요 버튼"
      >
        <Heart
          size={22}
          className={
            liked
              ? "text-rose-500 fill-rose-500"
              : "text-gray-500 fill-transparent"
          }
        />
      </button>
      <span>{likeCount}</span>
    </div>
  );
}
