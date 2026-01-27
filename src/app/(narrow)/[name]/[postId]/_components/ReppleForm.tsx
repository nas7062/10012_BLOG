"use client ";
import { useRef } from "react";

import { useCreateComment } from "../_hook/useCreateComment";
import { IRepple, IUser } from "@/src/app/type";

export default function ReppleForm({
  user,
  postId,
  reppleCount,
}: {
  user: IUser | null;
  postId: string;
  reppleCount?: number;
  onCreated?: (repple: IRepple) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleResizeHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  const { mutate, isPending } = useCreateComment();

  const handleSubmit = () => {
    if (textareaRef.current?.value && user?.id && user.name)
      mutate({
        postId: Number(postId),
        content: textareaRef.current?.value,
        userid: user?.id,
        name: user?.name,
      });
  };

  return (
    <div className="flex flex-col gap-4 w-full h-32">
      <p>{reppleCount}개의 댓글</p>
      {user ? (
        <>
          <textarea
            ref={textareaRef}
            onInput={handleResizeHeight}
            rows={1}
            className="resize-none w-full min-h-16 h-auto bg-slate-200 rounded-lg text-black p-2"
          />

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="ml-auto  border border-green-400  rounded-xl px-4 py-1 cursor-pointer bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
          >
            댓글 작성
          </button>
        </>
      ) : (
        <div className="w-full bg-gray-200 h-20">
          <div className="flex justify-center items-center h-full">
            <p className="text-sm text-center">
              로그인 시 댓글 작성 가능합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
