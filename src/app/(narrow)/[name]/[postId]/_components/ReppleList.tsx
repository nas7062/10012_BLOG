import { IRepple, IUser } from "@/src/app/_components/PostDetail";
import Repple from "./Repple";

export default function ReppleList({
  repples,
  user,
  postId,
  onDelete,
}: {
  repples: IRepple[] | null;
  user: IUser | null;
  postId: string;
  onDelete: (comment: number) => void;
}) {
  if (!repples) return;
  return repples.map((repple) => (
    <Repple
      key={repple.id}
      repple={repple}
      user={user}
      postId={postId}
      onDelete={onDelete}
    />
  ));
}
