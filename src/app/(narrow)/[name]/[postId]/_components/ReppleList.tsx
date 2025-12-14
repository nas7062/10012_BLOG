import { IRepple, IUser } from "@/src/app/_components/PostDetail";
import Repple from "./Repple";

export default function ReppleList({
  repples,
  user,
  onDelete,
  postId,
}: {
  repples: IRepple[] | null;
  user: IUser | null;
  onDelete: (id: number) => void;
  postId: string;
}) {
  if (!repples) return;
  return repples.map((repple) => (
    <Repple
      key={repple.id}
      repple={repple}
      user={user}
      onDelete={onDelete}
      postId={postId}
    />
  ));
}
