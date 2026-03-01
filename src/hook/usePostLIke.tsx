"use client";
import { useEffect, useState } from "react";
import { useLike } from "./useLike";
import { useToggleLike } from "./useToggleLike";

export const usePostLike = (postId: number, email: string) => {
  const { data } = useLike(postId, email);
  const liked = data?.liked ?? false;

  const serverLikeCount = data?.likeCount;

  const [likeCount, setLikeCount] = useState<number>(serverLikeCount ?? 0);
  const toggleLike = useToggleLike(email, postId);

  const toggle = (onRequireLogin?: () => void) => {
    if (!email) {
      onRequireLogin?.();
      return;
    }

    const willLike = !liked;

    setLikeCount((prev) => prev + (willLike ? 1 : -1));

    toggleLike.mutate(undefined, {
      onSuccess: (res: any) => {
        if (typeof res?.likeCount === "number") {
          setLikeCount(res.likeCount);
        }
      },
      onError: () => {
        setLikeCount((prev) => prev - (willLike ? 1 : -1));
      },
    });
  };

  useEffect(() => {
    if (typeof data?.likeCount === "number") {
      setLikeCount(data?.likeCount);
    }
  }, [data?.likeCount]);

  return { liked, likeCount, toggle };
};
