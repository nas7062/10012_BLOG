"use client";

import SinglePostList from "@/src/app/_components/SinglePostList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GithubIcon, MailIcon } from "lucide-react";
import { useCurrentUser } from "@/src/app/hook/useCurrentUser";
import Image from "next/image";
import { useMyPost } from "../_hook/useMyPost";
import Tabs from "./Tabs";
import { TagSlider } from "./TagSlider";
import { useEffect, useState } from "react";
import { getFollowCounts } from "@/src/app/_lib/getFollowCount";
import Link from "next/link";

export default function PostClient() {
  const id = usePathname().split("/")[1];
  const searchParams = useSearchParams();
  const router = useRouter();
  const tag = searchParams.get("tag") as string;
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { user: userData, isLoading: isUserLoading } = useCurrentUser({
    id,
  });
  const email = userData?.email as string;
  const { posts, isLoading: isPostsLoading } = useMyPost(email, tag);

  const MoveFollower = () => {
    const url = window.origin + "/" + id + "/follower";
    router.push(url);
  };

  const MoveFollowing = () => {
    const url = window.origin + "/" + id + "/following";
    router.push(url);
  };

  useEffect(() => {
    if (!id) return;
    const fetchFollow = async () => {
      const data = await getFollowCounts(id);
      if (data?.followerCount) setFollowerCount(data?.followerCount);
      if (data?.followingCount) setFollowingCount(data?.followingCount);
    };
    fetchFollow();
  }, [id]);
  console.log(userData?.github);
  if (isUserLoading || isPostsLoading) return "loading...";
  if (!posts) return;
  return (
    <div className="bg-primary text-primary-foreground flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="flex items-center  gap-4 p-4 border-b border-gray-200">
          <Image
            src={userData?.image || "/nextImage.png"}
            width={100}
            height={100}
            alt="이미지"
            className="rounded-full w-32 h-32"
          />
          <div className="flex flex-col gap-2">
            <p className="text-4xl">{userData?.name}</p>
            <p className="text-gray-500 ml-2">{userData?.descript}</p>
          </div>
        </div>
        <div className="flex justify-end gap-4 py-4">
          <p
            onClick={MoveFollower}
            className="cursor-pointer hover:text-gray-300"
          >
            {followerCount} 팔로우
          </p>
          <p
            onClick={MoveFollowing}
            className="cursor-pointer  hover:text-gray-300"
          >
            {followingCount} 팔로잉
          </p>
        </div>
        <div className="flex gap-4">
          {userData?.github && (
            <Link href={`${userData.github}`} target="_blank">
              <GithubIcon className="w-8 h-8 cursor-pointer" />
            </Link>
          )}
        </div>
      </div>
      <Tabs />
      <TagSlider />
      <SinglePostList posts={posts} />
    </div>
  );
}
