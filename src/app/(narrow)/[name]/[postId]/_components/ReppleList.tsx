import { IRepple, IUser } from "@/src/app/_components/PostDetail";
import Repple from "./Repple";

export default function ReppleList({
  repples,
  user,
  onDelete,
  postId,
  onOpen,
  onClose,
}: {
  repples: IRepple[] | null;
  user: IUser | null;
  onDelete: (id: number) => void;
  postId: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  if (!repples) return;
  return repples.map((repple) => (
    <Repple
      key={repple.id}
      repple={repple}
      user={user}
      onDelete={onDelete}
      onOpen={onOpen}
      onClose={onClose}
      postId={postId}
    />
  ));
}
