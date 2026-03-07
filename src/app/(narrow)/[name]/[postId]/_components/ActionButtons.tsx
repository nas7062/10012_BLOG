"use client";

import { Heart, Link, Share2, Waypoints } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { usePostLike } from "@/src/hook/usePostLIke";
import { usePostById } from "@/src/hook/usePostById";
import { useModal } from "@/src/provider/ModalProvider";

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
  const sharePanelRef = useRef<HTMLDivElement>(null);

  const handleToggleLike = () => {
    toggle(() => openLoginModal());
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  // ESC 키로 공유 패널 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isShare) {
        setIsShare(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isShare]);

  // 공유 패널 외부 클릭 감지
  useEffect(() => {
    if (!isShare) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        sharePanelRef.current &&
        !sharePanelRef.current.contains(e.target as Node)
      ) {
        setIsShare(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShare]);

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

  if (isPostLoading)
    return (
      <div aria-live="polite" aria-busy="true">
        loading...
      </div>
    );

  return (
    <div
      className="flex flex-col h-44 w-20 rounded-4xl justify-between items-center py-2 text-primary bg-green-300 border border-green-300 overflow-x-hidden"
      role="toolbar"
      aria-label="게시글 액션"
    >
      {/* 좋아요 버튼 */}
      <button
        className="w-14 h-14 rounded-full flex justify-center items-center border border-primary cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-400"
        onClick={handleToggleLike}
        onKeyDown={(e) => handleKeyDown(e, handleToggleLike)}
        aria-label={liked ? "좋아요 취소" : "좋아요"}
        aria-pressed={liked}
      >
        {liked ? (
          <Heart
            className="w-8 h-8 group-hover:fill-gray-500 fill-red-500"
            aria-hidden="true"
          />
        ) : (
          <Heart
            className="w-8 h-8 group-hover:fill-red-500"
            aria-hidden="true"
          />
        )}
      </button>

      <p className="text-lg font-semibold" aria-live="polite">
        {likeCount}
      </p>

      {/* 공유 버튼 */}
      <button
        className="w-14 h-14 rounded-full flex justify-center items-center border border-primary group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-400"
        onClick={() => setIsShare(!isShare)}
        onKeyDown={(e) => handleKeyDown(e, () => setIsShare(!isShare))}
        aria-label="공유 옵션"
        aria-expanded={isShare}
        aria-haspopup="menu"
      >
        <Share2 className="w-8 h-8 group-hover:fill-black" aria-hidden="true" />
      </button>

      {/* 공유 패널 */}
      <div
        ref={sharePanelRef}
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
        role="menu"
        aria-label="공유 옵션"
        aria-hidden={!isShare}
      >
        <button
          className="border border-primary hover:border-gray-400 rounded-full w-10 h-10 p-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => alert("개발중 입니다")}
          aria-label="공유 방법 1"
          role="menuitem"
        >
          <Waypoints className="w-full h-full" aria-hidden="true" />
        </button>
        <button
          className="border border-primary hover:border-gray-400 rounded-full w-10 h-10 p-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={copyURL}
          aria-label="링크 복사"
          role="menuitem"
        >
          <Link className="w-full h-full" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
