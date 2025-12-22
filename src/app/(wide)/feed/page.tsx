"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getFollowPosts } from "../../_lib/getFollowPosts";
import { useEffect, useState } from "react";
import { IPost } from "../write/_components/WirtePageClient";
import { useCurrentUser } from "../../hook/useCurrentUser";
import Post from "../../_components/Post";

export default function FeedPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email as string;
  const [posts, setPosts] = useState<IPost[] | null>([]);
  const { user: userData, isLoading: isUserLoading } = useCurrentUser({
    email,
  });

  useEffect(() => {
    if (!userData?.id) return;
    const fetchFeed = async () => {
      const data = await getFollowPosts(userData?.id);
      console.log(data);
      setPosts(data);
    };
    fetchFeed();
  }, [userData?.id]);

  if (!posts)
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <Image
          src="/character.png"
          alt="곰 이미지"
          width={300}
          height={300}
          className="w-72 h-72"
        />
        <p>로그인 하고 개인화된 기능을 사용해봐요!</p>
        <button
          onClick={() => router.push("/signin")}
          className="px-4 py-2 bg-green-400 hover:bg-green-500 text-primary rounded-xl cursor-pointer"
        >
          로그인 하기
        </button>
      </div>
    );
  if (posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <Image
          src="/character.png"
          alt="곰 이미지"
          width={300}
          height={300}
          className="w-72 h-72"
        />
        <p>팔로우 한 글이 없어요...</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-green-400 hover:bg-green-500 text-primary rounded-xl cursor-pointer"
        >
          글 보러가기
        </button>
      </div>
    );
  }
  return (
    <div className="grid max-[450px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
