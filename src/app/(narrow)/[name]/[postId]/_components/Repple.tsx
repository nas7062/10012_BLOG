"use client";

import { IRepple, IUser } from "@/src/app/_components/PostDetail";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { useRef, useState } from "react";
import { useCurrentUser } from "@/src/app/hook/useCurrentUser";
import Image from "next/image";
import { useUpdateComment } from "../_hook/useUpdateComment";
import { useModal } from "@/src/app/provider/ModalProvider";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export default function Repple({
  user,
  repple,
  onDelete,
  postId,
}: {
  user: IUser | null;
  repple: IRepple;
  onDelete: (id: number) => void;
  postId: string;
}) {
  const [isUpdate, setIsUpdate] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { openModal } = useModal();
  const repplerUserId = repple.userid as string;
  const { user: reppleUser, isLoading: isUserLoading } = useCurrentUser({
    id: repplerUserId,
  });
  const handleResizeHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const changeUpdate = () => {
    setIsUpdate((prev) => !prev);
  };

  const { mutate: updateCommentMutate, isPending } = useUpdateComment(user?.id);

  const handleUpdate = () => {
    if (textareaRef.current?.value) {
      changeUpdate();
      updateCommentMutate({
        id: repple.id,
        postId: Number(postId),
        content: textareaRef.current?.value,
      });
    }
  };
  const isMyRepple = repple.userid === user?.id;
  if (isUserLoading) return "loading...";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Image
          src={reppleUser?.image ? reppleUser?.image : "/noImage.jpg"}
          alt="댓글 이미지"
          width={20}
          height={20}
          className="w-14 h-14 rounded-full"
        />
        <div className="flex flex-col gap-2">
          <p>{reppleUser?.name}</p>
          <p>{dayjs(repple?.updatedat).format("YYYY년 MM월 DD일")}</p>
        </div>
        <div className="flex gap-2 ml-auto">
          {isMyRepple && (
            <>
              {!isUpdate ? (
                <button
                  className="hover:text-gray-400 cursor-pointer"
                  onClick={changeUpdate}
                >
                  수정
                </button>
              ) : (
                <button
                  className="hover:text-gray-400 cursor-pointer"
                  onClick={handleUpdate}
                  disabled={isPending}
                >
                  수정완료
                </button>
              )}

              <button
                className="hover:text-red-400 cursor-pointer"
                onClick={() => openModal("deleteComment")}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
      {isUpdate ? (
        <textarea
          ref={textareaRef}
          onInput={handleResizeHeight}
          rows={1}
          defaultValue={repple.content ? repple.content : ""}
          className="resize-none w-full min-h-16 h-auto bg-slate-200 rounded-lg text-black p-2"
        />
      ) : (
        <div>{repple?.content}</div>
      )}
    </div>
  );
}
