"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Post from "../../_components/Post";
import { useLikePosts } from "../../hook/useLikePosts";
import { SkeletonPost } from "../../_components/SkeletonPost";

export default function LikePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const email = session?.user?.email ?? "";
  const { posts, isLoading } = useLikePosts(email);

  if (status === "loading") {
    return (
      <div className="grid max-[450px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    );
  }

  if (status === "unauthenticated" || !email) {
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
  }

  if (isLoading) {
    return (
      <div className="grid max-[450px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <Image
          src="/character.png"
          alt="곰 이미지"
          width={300}
          height={300}
          className="w-72 h-72"
        />
        <p>좋아하는 글이 없어요...</p>
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
