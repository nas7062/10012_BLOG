import { usePostAuthor } from "../../hook/usePostAuthor";
import { usePostById } from "../../hook/usePostById";
import { useCurrentUser } from "../../hook/useCurrentUser";
import { useGetComment } from "../../hook/useGetComment";
import { useSession } from "next-auth/react";

export function usePostDetailData(postId: number) {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const { data: writeUser, isLoading: isAuthorLoading } =
    usePostAuthor(postId);
  const { data: post, isLoading: isPostLoading } = usePostById(postId);
  const { user, isLoading: isUserLoading, isError } = useCurrentUser({
    email,
  });
  const { comments, isLoading: isReppleLoading } = useGetComment(post?.id);

  const isLoading =
    isAuthorLoading || isPostLoading || isUserLoading || isReppleLoading;

  const isUpdate = post?.email === session?.user?.email;

  return {
    writeUser,
    post,
    user,
    comments,
    isLoading,
    isError,
    isUpdate,
  };
}

