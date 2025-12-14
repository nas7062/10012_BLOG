"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "이메일을 입력해주세요" })
    .max(40, { message: "이메일은 40자 이하로 입력해주세요" })
    .email({ message: "올바른 이메일 주소를 입력해주세요" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "비밀번호를 6자 이상 입력해주세요" })
    .max(20, { message: "비밀번호를 20자 이하로 입력해주세요" })
    .regex(/^\S+$/, {
      message: "비밀번호에는 공백을 포함할 수 없습니다",
    })
    .regex(/[0-9]/, {
      message: "비밀번호에는 숫자가 최소 1개 이상 포함되어야 합니다",
    }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInModal() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (session?.user) {
      router.replace("/");
    }
  }, [session, router]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.status !== 200) {
        toast.error("로그인을 다시 시도해주세요");
        return;
      } else router.replace("/");
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-center py-2 gap-4">
        <h2 className="text-3xl text-center">로그인</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-1 ">
            <label
              htmlFor="email"
              className=" text-xs  sm:text-sm bg-gray-400 px-2 py-2 rounded-md w-28 flex justify-center items-center"
            >
              이메일
            </label>
            <input
              type="text"
              id="email"
              autoFocus
              disabled={loading}
              {...register("email")}
              placeholder="이메일을 입력하세요"
              className="border border-gray-300 rounded-md flex-1 px-2 outline-none focus:border-2 focus:border-gray-700 "
            />
          </div>
          {errors.email && (
            <p className="text-sm  text-red-500">{errors.email.message}</p>
          )}
          <div className="flex gap-1 ">
            <label
              htmlFor="password"
              className="text-xs  sm:text-sm bg-gray-400 px-2 py-2 rounded-md  w-28 flex justify-center items-center "
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              disabled={loading}
              {...register("password")}
              placeholder="비밀번호를 입력하세요"
              className="border border-gray-300 rounded-md flex-1 px-2   outline-none focus:border-2 focus:border-gray-700"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <button
            type="submit"
            className=" bg-green-400 py-3 text-2xl hover:bg-emerald-400 rounded-lg text-white cursor-pointer transition-colors duration-300"
          >
            로그인
          </button>
          <button
            type="button"
            className="f-full"
            onClick={() => signIn("kakao", { callbackUrl: "/" })}
          >
            <Image
              src={"/kakao_btn.png"}
              alt="카카오 로그인 버튼"
              width={300}
              height={30}
              className="w-full h-14 cursor-pointer rounded-lg overflow-hidden"
            />
          </button>
        </form>
        <div className="flex justify-end gap-2 text-green-500">
          <p>회원가입을 안했다면?</p>
          <Link href={"/signup"}>
            <strong className="cursor-pointer hover:text-green-400">
              회원가입
            </strong>
          </Link>
        </div>
        <div className="absolute top-0 right-0">
          <Image
            src="/hello.png"
            alt="곰 이미지"
            className="w-20 h-20"
            width={40}
            height={40}
          />
        </div>
      </div>
    </div>
  );
}
