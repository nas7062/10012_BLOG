import { FollowButton } from "@/src/app/_components/FollowButton";
import { IUser } from "@/src/app/_components/PostDetail";
import Image from "next/image";
import Link from "next/link";

export default function FollowUser({
  follow,
  user,
  userId,
}: {
  follow: IUser;
  user: IUser | null;
  userId: string;
}) {
  console.log("userId", user?.id);
  console.log("current", userId);
  return (
    <div key={follow.id}>
      <div className="flex gap-4 items-center">
        <Link href={`/${follow.id}/posts`} className="flex gap-4">
          <Image
            src={follow?.image ? follow.image : "/hello.png"}
            alt="유저 이미지"
            width={50}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col gap-1">
            <div>{follow.name}</div>
            <div>{follow.descript}</div>
          </div>
        </Link>
        {user?.id === userId && (
          <div className="ml-auto">
            <FollowButton userId={user?.id} targetId={follow.id} />
          </div>
        )}
      </div>
    </div>
  );
}
