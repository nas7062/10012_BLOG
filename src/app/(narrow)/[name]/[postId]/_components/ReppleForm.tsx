"use client ";
import { useRef } from "react";

import { useCreateComment } from "../_hook/useCreateComment";
import { IRepple, IUser } from "@/src/types";

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
    const v = textareaRef.current?.value?.trim();
    if (!v || !user?.id) return;

    const name =
      user.name && user.name.trim().length > 0
        ? user.name
        : user.email || "익명";

    mutate({
      postId: Number(postId),
      content: v,
      userid: user.id,
      name,
    });

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
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
            data-testid="comment-input"
            className="resize-none w-full min-h-16 h-auto bg-slate-200 rounded-lg text-black p-2"
          />

          <button
            onClick={handleSubmit}
            disabled={isPending}
            data-testid="comment-submit"
            className="ml-auto  border border-green-400  rounded-xl px-4 py-1 cursor-pointer bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
          >
            댓글 작성
          </button>
        </>
      ) : (
        <div data-testid="comment-need-login" className="w-full bg-gray-200 h-20">
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
