import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getFollowInfo } from "@/src/app/_lib/getFollowInfo";
import { getUserById } from "@/src/app/_lib/getUserById";
import FollowerClient from "../_components/FollowClient";

type Props = {
  params: {
    name: string;
  };
};

export default async function FollowingPage({ params }: Props) {
  const { name } = await params;

  const user = await getUserById(name);
  const followInfo = await getFollowInfo(name);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4 text-primary">
      <div className="flex gap-2 items-center">
        <Image
          src={user.image ?? "/hello.png"}
          alt="유저 이미지"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>{user.name}</div>
        <ChevronRight />
        <div>팔로잉</div>
      </div>
      <h2>{followInfo?.followingCount ?? 0}명을 팔로우 중</h2>
      <FollowerClient followers={followInfo?.followings ?? []} user={user} />
    </div>
  );
}
