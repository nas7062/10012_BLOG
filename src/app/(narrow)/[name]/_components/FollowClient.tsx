"use client";

import { IUser } from "@/src/app/_components/PostDetail";
import FollowUser from "../_components/FollowUser";
import { useCurrentUser } from "@/src/app/hook/useCurrentUser";
import { useSession } from "next-auth/react";

type Props = {
  followers: IUser[];
  user: IUser;
};

export default function FollowerClient({ followers, user }: Props) {
  const { data: curUser } = useSession();
  const { user: currentUser } = useCurrentUser({ email: curUser?.user?.id });

  return (
    <>
      {followers.map((follow) => (
        <FollowUser
          key={follow.id}
          follow={follow}
          user={user}
          userId={currentUser?.id as string}
        />
      ))}
    </>
  );
}
