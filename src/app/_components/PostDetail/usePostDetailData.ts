import { usePostAuthor } from "../../hook/usePostAuthor";
import { usePostById } from "../../hook/usePostById";
import { useCurrentUser } from "../../hook/useCurrentUser";
import { useGetComment } from "../../hook/useGetComment";
import { useSession } from "next-auth/react";
import { IPost, IRepple, IUser } from "../../type";

interface InitialData {
  post: IPost | null;
  writeUser: IUser | null;
  comments: IRepple[];
  user: IUser | null;
  isUpdate: boolean;
}

export function usePostDetailData(
  postId: number,
  initialData?: InitialData
) {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  // initialData가 있으면 서버 데이터를 initialData로 사용
  const { data: writeUser, isLoading: isAuthorLoading } = usePostAuthor(
    postId
  );
  
  const { data: post, isLoading: isPostLoading } = usePostById(postId);
  
  const { user, isLoading: isUserLoading, isError } = useCurrentUser({
    email,
  });
  
  const { comments, isLoading: isReppleLoading } = useGetComment(
    post?.id ?? initialData?.post?.id
  );

  // initialData가 있으면 로딩 상태 무시
  const isLoading =
    !initialData && (isAuthorLoading || isPostLoading || isUserLoading || isReppleLoading);

  const isUpdate =
    initialData?.isUpdate ?? (post?.email === session?.user?.email);

  return {
    writeUser: writeUser ?? initialData?.writeUser ?? null,
    post: post ?? initialData?.post ?? null,
    user: user ?? initialData?.user ?? null,
    comments: comments ?? initialData?.comments ?? [],
    isLoading,
    isError: isError && !initialData,
    isUpdate,
  };
}