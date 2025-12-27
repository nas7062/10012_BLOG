import { useRouter } from "next/navigation";
import { IUser } from "../type";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { FollowButton } from "./FollowButton";
import { usePostLike } from "../hook/usePostLIke";
import { useModal } from "../provider/ModalProvider";

type Props = {
  isUpdate: boolean;
  postId: string;
  user: IUser | null;
  writeUser: IUser;
  openDeletePostModal: () => void;
};

export function UpdateOrHeart({
  isUpdate,
  postId,
  user,
  writeUser,
  openDeletePostModal,
}: Props) {
  const router = useRouter();
  const { liked, likeCount, toggle } = usePostLike(
    Number(postId),
    user?.email as string
  );
  const { openModal } = useModal();

  const openLoginModal = () => openModal("LoginModal");

  const handleToggleLike = () => {
    toggle(() => openLoginModal());
  };

  if (!writeUser) return;
  return (
    <>
      {isUpdate ? (
        <div className="flex gap-2">
          <p
            className="cursor-pointer text-gray-500 hover:text-green-500"
            onClick={() => router.push(`/write?id=${postId}`)}
          >
            수정
          </p>
          <p
            className="cursor-pointer text-gray-500 hover:text-red-500"
            onClick={openDeletePostModal}
          >
            삭제
          </p>
        </div>
      ) : (
        <div className="flex gap-1">
          <FollowButton userId={user?.id} targetId={writeUser.id} />
          <button
            onClick={handleToggleLike}
            className="flex gap-1 border border-gray-300 px-2 py-1 rounded-lg lg:hidden items-center"
          >
            <Heart
              className={clsx(
                liked
                  ? "text-rose-500 fill-rose-500"
                  : "text-gray-500 fill-transparent"
              )}
              fill={liked ? "currentColor" : "none"}
              strokeWidth={liked ? 1.75 : 2}
              size={20}
            />
            <p>{likeCount}</p>
          </button>
        </div>
      )}
    </>
  );
}
