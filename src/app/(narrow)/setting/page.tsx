"use client";
import { useSession } from "next-auth/react";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTheme } from "next-themes";
import { userDelete } from "./_lib/userDelete";
import { useCurrentUser } from "../../hook/useCurrentUser";
import Image from "next/image";
import { updateInfo } from "./_lib/updateInfo";
export interface AboutThumbnailPreview {
  url: string;
  name: string;
  size: number;
}

export default function SettingPage() {
  const { data: user } = useSession();
  const email = user?.user?.email ?? "";
  const { user: userData, isLoading: isUserLoading } = useCurrentUser({
    email,
  });
  const [name, setName] = useState("");
  const [descript, setdescript] = useState("");
  const [github, setGibhub] = useState("");
  const [mode, setMode] = useState<"Update" | "Default">("Default");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const { setTheme } = useTheme();
  const [thumbnailPreview, setThumbnailPreview] =
    useState<AboutThumbnailPreview | null>(null);
  //사진이 추가됐을 때 그 사진의 정보 상태담기
  const onDropThumbnail = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setThumbnailFile(file);
    //file 첫번째 파일을 저장
    const fileURL = URL.createObjectURL(file);
    //createObjectURL는 임시로 URL을 저장할수 있는 메서드
    setThumbnailPreview({ url: fileURL, name: file.name, size: file.size });
  }, []);

  const handleDeleteThumbnail = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setThumbnailPreview(null);
    setThumbnailFile(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    //이미지가 들어가면 실행되는 함수
    onDrop: onDropThumbnail,
    //받는 이미지 확장자 리밋 설정
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const handleUpdateInfo = async () => {
    if (!email) return;
    await updateInfo({
      name,
      descript,
      image: userData?.image ?? "",
      email,
      github,
      thumbnailFile,
    });
  };

  const changeMode = () => {
    setMode((prev) => (prev === "Default" ? "Update" : "Default"));
  };
  const OnSave = () => {
    setName(name);
    setdescript(descript);
    setGibhub(github);
    changeMode();
  };

  const OnDelete = async () => {
    const response = await userDelete(email);
  };

  const imageSrc = thumbnailPreview?.url || userData?.image || "/hello.png";

  useEffect(() => {
    if (!userData) return;
    setName(userData.name ?? "");
    setdescript(userData.descript ?? "");
    setGibhub(userData.github ?? "");
  }, [userData]);

  useEffect(() => {
    if (!thumbnailPreview?.url) return;
    return () => {
      URL.revokeObjectURL(thumbnailPreview.url);
    };
  }, [thumbnailPreview?.url]);

  if (isUserLoading) return "loading...";
  if (!userData) return;
  return (
    <div className="flex flex-col min-h-screen py-20 px-2 gap-10">
      <div className="flex gap-10">
        <div className="flex flex-col gap-4 justify-center items-center">
          <Image
            src={imageSrc}
            className="rounded-full"
            alt="이미지를 업로드해주세요"
            width={100}
            height={100}
          />

          <div
            {...getRootProps()}
            className="px-4 py-2 text-sm bg-green-400 text-white hover:bg-green-500 rounded-lg cursor-pointer"
          >
            이미지 업로드 <input {...getInputProps()} />
          </div>
          <button
            onClick={handleDeleteThumbnail}
            className="px-4 py-2 text-sm bg-red-400 text-white hover:bg-red-500 rounded-lg cursor-pointer"
          >
            이미지 제거
          </button>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {mode === "Default" ? (
            <>
              <h3 className="text-4xl text-primary font-semibold">
                {name || userData.name}
              </h3>
              <p className="text-gray-500">{descript || userData.descript}</p>
            </>
          ) : (
            <>
              <input
                type="text"
                className="border border-gray-300 focus:border-gray-800 rounded-md h-10 px-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                className="border border-gray-300 focus:border-gray-800 rounded-md px-2 "
                value={descript}
                onChange={(e) => setdescript(e.target.value)}
              />
            </>
          )}

          <button
            className="text-green-500 cursor-pointer self-start"
            onClick={mode === "Default" ? changeMode : OnSave}
          >
            {mode === "Default" ? " 수정하기" : "수정완료"}
          </button>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <h3 className="text-xl!">GibHub 주소</h3>
        {mode === "Default" ? (
          <p>{github || userData.github}</p>
        ) : (
          <input
            type="email"
            value={github}
            className="flex-1 border border-gray-300 focus:border-gray-800 rounded-md px-2 py-1"
            onChange={(e) => setGibhub(e.target.value)}
          />
        )}
      </div>
      <button
        onClick={handleUpdateInfo}
        className="px-4 py-2 text-sm bg-green-400 text-white hover:bg-green-500 rounded-lg cursor-pointer ml-auto"
      >
        저장하기
      </button>
      <div className="flex justify-between items-center gap-2">
        <h3 className="text-xl! w-28 text-center">테마</h3>
        <button
          onClick={() => setTheme("dark")}
          className="flex-1 bg-black text-white py-2 rounded-md cursor-pointer"
        >
          다크
        </button>
        <button
          onClick={() => setTheme("light")}
          className="flex-1 bg-gray-100 text-black py-2 rounded-md cursor-pointer"
        >
          화이트
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl! w-28 text-center">회원 탈퇴</h3>
        <button
          onClick={OnDelete}
          className="px-4 py-2 text-sm bg-red-400 text-white hover:bg-red-500 rounded-lg cursor-pointer"
        >
          회원탈퇴
        </button>
      </div>

      <p className="text-gray-400">
        탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
      </p>
    </div>
  );
}
