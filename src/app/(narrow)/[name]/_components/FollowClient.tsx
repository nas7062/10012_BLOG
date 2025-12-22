"use client";

import { IUser } from "@/src/app/_components/PostDetail";
import FollowUser from "../_components/FollowUser";

type Props = {
  followers: IUser[];
  user: IUser;
};

export default function FollowerClient({ followers, user }: Props) {
  return (
    <>
      {followers.map((follow) => (
        <FollowUser key={follow.id} follow={follow} user={user} />
      ))}
    </>
  );
}
