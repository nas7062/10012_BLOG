"use client";

import React, {
  FormEventHandler,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { useDropzone } from "react-dropzone";
import { AboutThumbnailPreview } from "@/src/app/(narrow)/setting/page";
import TuiEditor from "./TuiEditor";
import TagList from "@/src/app/_components/TagList";
import Viewer from "./View";
import { getSupabaseClient } from "@/src/app/api/supabase";
import Image from "next/image";
import { useCurrentUser } from "@/src/app/hook/useCurrentUser";

export interface IPost {
  coverImgUrl: string;
  createdAt: string;
  description: string;
  id: number;
  searchIndex?: string | null;
  title: string;
  updatedAt: string;
  userId: string | null;
  Tags?: string[] | null;
  likeCount?: number | null;
  email?: string | null;
  reppleCount?: number;
}

export default function WritePageClient() {
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");

  const searchParmas = useSearchParams();
  const postId = searchParmas.get("id");

  const router = useRouter();
  const { data: user } = useSession();

  const email = user?.user?.email as string;
  const { user: userData, isLoading: isUserLoading } = useCurrentUser({
    email,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [getContent, setGetContent] = useState("");
  const [post, setPost] = useState<IPost>();
  const supabase = getSupabaseClient();
  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("Post")
        .select("*")
        .eq("id", Number(postId))
        .single();

      if (error) {
        console.error("게시물 조회 오류:", error);
      } else if (data) {
        setPost(data);
        setTags((prevTags) => {
          const newTags = data.Tags || [];
          return [...new Set([...prevTags, ...newTags])];
        });

        setTitle((prevTitle) => prevTitle || data.title);
        setGetContent((prevContent) => prevContent || data.description);
      }
    };

    fetchPost();
  }, [postId, supabase, post]);

  const [thumbnailPreview, setThumbnailPreview] =
    useState<AboutThumbnailPreview>();

  const onDropThumbnail = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setThumbnailFile(file);
    const fileURL = URL.createObjectURL(file);
    setThumbnailPreview({ url: fileURL, name: file.name, size: file.size });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropThumbnail,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const uid = userData?.id;
    if (!uid) return;

    if (!title || !getContent) {
      toast.error("제목 또는 내용을 입력 해주세요.");
      return;
    }

    let imageUrl = post?.coverImgUrl || "/noImage.jpg";

    // 1. 썸네일 파일이 있을 때만 업로드
    if (thumbnailFile) {
      const fileKey = postId ? `Post-${postId}` : `Post-${uid}`;

      const { error: uploadError } = await supabase.storage
        .from("Post")
        .upload(fileKey, thumbnailFile, {
          upsert: true,
        });

      if (uploadError) {
        toast.error("이미지 업로드에 실패했습니다.");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("Post")
        .getPublicUrl(fileKey);

      const versionedUrl = `${urlData.publicUrl}?v=${Date.now()}`;

      imageUrl = versionedUrl;
    }

    // 2. 수정 모드
    if (postId) {
      const { error: updateError } = await supabase
        .from("Post")
        .update({
          title,
          description: getContent,
          updatedAt: new Date().toISOString(),
          coverImgUrl: imageUrl,
          Tags: tags,
        })
        .eq("id", Number(postId));

      if (updateError) {
        toast.error("글 수정에 실패했습니다.");
        console.error("Supabase update error:", updateError);
      } else {
        toast.success("글이 수정되었습니다.");
        router.push(`/${user?.user?.name}/${postId}`);
      }

      return;
    }

    // 3. 새 글 작성 모드
    const { data, error } = await supabase
      .from("Post")
      .insert([
        {
          title,
          description: getContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: uid,
          email: user?.user?.email,
          coverImgUrl: imageUrl,
          Tags: tags,
        },
      ])
      .select();

    if (error) {
      toast.error("글 작성에 실패했습니다.");
      console.error("Supabase insert error:", error);
    } else if (data && data[0]) {
      router.push(`/${user?.user?.name}/${data[0].id}`);
    }
  };

  const handleTagsPlus = () => {
    if (!tag.trim()) return;
    setTags((prev) => [...prev, tag.trim()]);
    setTag("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTagsPlus();
      e.preventDefault();
    }
  };

  const changeContent = (value: string) => {
    setGetContent(value);
  };

  const onDeleteTag = (tagname: string) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tagname));
  };

  if (isUserLoading) return "loading...";
  if (!post && !postId) return "Loading...";
  return (
    <main className="h-screen w-full flex flex-col sm:flex-row  gap-4  sm:gap-9 text-primary">
      <form
        onSubmit={onSubmit}
        className="text-center flex flex-1 flex-col gap-2 sm:gap-4"
      >
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="h-20 text-4xl outline-none font-semibold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="태그를 입력하세요"
          className="h-14 text-xl outline-none font-semibold"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <TagList tags={tags} onDelete={onDeleteTag} />
        <div className="bg-white h-[500px]  text-left ">
          <TuiEditor content={getContent} contentChange={changeContent} />
        </div>
        <div className="flex items-center lg:hidden  ">
          <Image
            src={thumbnailPreview?.url || "/noImage.jpg"}
            alt="이미지를 업로드해주세요"
            width={80}
            height={80}
            className="rounded-full w-20 h-20"
          />
          <div
            {...getRootProps()}
            className="ml-auto w-32 h-10 px-4 py-2 text-sm bg-green-400 text-white hover:bg-green-500 rounded-lg cursor-pointer"
          >
            썸네일 업로드 <input {...getInputProps()} />
          </div>
        </div>
        <button
          type="submit"
          className="text-base py-2 px-5 bg-green-500 text-white hover:bg-green-400 cursor-pointer transition-colors duration-300 rounded-full mt-9"
        >
          {postId ? "글 수정하기" : "글 작성하기"}
        </button>
      </form>
      <div className="w-1/2 lg:flex flex-col  hidden">
        <div className="flex items-center ">
          <Image
            src={thumbnailPreview?.url || "/noImage.jpg"}
            alt="이미지를 업로드해주세요"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div
            {...getRootProps()}
            className="ml-auto w-32 h-10 px-4 py-2 text-sm bg-green-400 text-white hover:bg-green-500 rounded-lg cursor-pointer"
          >
            썸네일 업로드 <input {...getInputProps()} />
          </div>
        </div>

        <div className="h-screen flex-1 mt-9 text-left border  border-[#ddd]">
          <Viewer content={getContent} />
        </div>
      </div>
    </main>
  );
}
