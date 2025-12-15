"use client";

import LoginModal from "@/src/app/_components/LoginModal";
import { Heart, Link, Share2, Waypoints } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { usePostLike } from "@/src/app/hook/usePostLIke";
import { usePostById } from "@/src/app/hook/usePostById";
import { useModal } from "@/src/app/provider/ModalProvider";

export default function ActionButtons() {
  const pathname = usePathname();
  const postId = pathname.split("/")[2];
  const { data: session } = useSession();
  const email = session?.user?.email as string;
  const { data: post, isLoading: isPostLoading } = usePostById(Number(postId));
  const { liked, likeCount, toggle } = usePostLike(Number(post?.id), email);
  const { openModal } = useModal();
  const openLoginModal = () => openModal("LoginModal");
  const [isShare, setIsShare] = useState(false);
  const handleToggleLike = () => {
    toggle(() => openLoginModal());
  };

  const onShared = () => {
    setIsShare((prev) => !prev);
  };
  const copyURL = async () => {
    const currentUrl = decodeURI(window.location.href);
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsShare(false);
      toast.success("클립보드에 복사되었습니다");
    } catch (e) {
      const t = document.createElement("textarea");
      console.error(e);
      document.body.appendChild(t);
      t.value = currentUrl;
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);

      setIsShare(false);
      toast.success("클립보드에 복사되었습니다");
    }
  };
  if (isPostLoading) return "loading...";
  return (
    <div className="flex flex-col h-44 w-20 rounded-4xl justify-between items-center py-2 text-primary bg-green-400 border border-green-400 overflow-x-hidden">
      {/* 좋아요 버튼 */}
      <div
        className="w-14 h-14 rounded-full flex justify-center items-center border border-primary cursor-pointer group"
        onClick={handleToggleLike}
      >
        {liked ? (
          <Heart className="w-8 h-8 group-hover:fill-gray-500 fill-red-500" />
        ) : (
          <Heart className="w-8 h-8 group-hover:fill-red-500" />
        )}
      </div>

      <p className="text-lg font-semibold">{likeCount}</p>

      {/* 공유 버튼 */}
      <div
        className="w-14 h-14 rounded-full flex justify-center items-center border border-primary group cursor-pointer"
        onClick={onShared}
      >
        <Share2 className="w-8 h-8 group-hover:fill-black" />
      </div>

      {/* 바깥 클릭용 오버레이는 isShare일 때만 */}
      {isShare && (
        <div className="fixed inset-0 z-40" onClick={() => setIsShare(false)} />
      )}

      {/* 실제 공유 패널: 항상 렌더, class만 토글 */}
      <div
        className={`
        fixed top-1/4 left-1/6 z-50
        transform transition-all duration-300
        text-primary space-y-2
        ${
          isShare
            ? "translate-x-10 opacity-100"
            : "translate-x-16 opacity-0 pointer-events-none"
        }
      `}
      >
        <Waypoints
          className="border border-primary hover:border-gray-400 rounded-full w-10 h-10 p-1.5 cursor-pointer"
          onClick={() => alert("개발중 입니다")}
        />
        <Link
          className="border border-primary hover:border-gray-400 rounded-full w-10 h-10 p-1.5 cursor-pointer"
          onClick={copyURL}
        />
      </div>
    </div>
  );
}
