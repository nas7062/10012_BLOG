"use client";

import Link from "next/link";
import Image from "next/image";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/src/app/provider/ModalProvider";

const SignUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "이름은 2글자 이상 입니다." })
      .max(6, { message: "이름은 6글자 이하입니다." }),
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
    passwordConfirm: z.string().trim(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다",
  });

const baseUrl = process.env.NEXT_PUBLIC_LOCAL_URL;

type SignupFormData = z.infer<typeof SignUpSchema>;

export default function SignUpModal() {
  const router = useRouter();
  const { closeModal } = useModal();

  const goSignInPage = () => {
    closeModal();
    queueMicrotask(() => router.push("/signIn"));
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("signup error:", res.status, body);

      return;
    }

    router.push("/signin");
  };

  return (
    <div>
      <div className="flex flex-col justify-center py-2 gap-4">
        <h2 className="text-3xl text-center">회원가입</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex gap-1">
            <label
              htmlFor="name"
              className="text-xs  sm:text-sm bg-gray-400 px-2 py-2 rounded-md w-28 flex justify-center items-center"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              placeholder="이름을 입력하세요"
              className="border border-gray-300 rounded-md flex-1 px-2 outline-none focus:border-2 focus:border-gray-700"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}

          <div className="flex gap-1">
            <label
              htmlFor="email"
              className="text-xs  sm:text-sm bg-gray-400 px-2 py-2 rounded-md w-28 flex justify-center items-center"
            >
              이메일
            </label>
            <input
              type="text"
              id="email"
              placeholder="이메일을 입력하세요"
              className="border border-gray-300 rounded-md flex-1 px-2 outline-none focus:border-2 focus:border-gray-700"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}

          <div className="flex gap-1">
            <label
              htmlFor="password"
              className="text-xs  sm:text-sm bg-gray-400 px-2 py-2 rounded-md w-28 flex justify-center items-center"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              className="border border-gray-300 rounded-md flex-1 px-2 outline-none focus:border-2 focus:border-gray-700"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <div className="flex gap-1 items-center">
            <label
              htmlFor="passwordConfirm"
              className="text-xs  sm:text-sm bg-gray-400 px-2 py-2 rounded-md w-28 flex justify-center items-center text-center"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="passwordConfirm"
              placeholder="비밀번호를 다시 입력하세요"
              className="border border-gray-300 rounded-md flex-1 px-2 py-2 outline-none focus:border-2 focus:border-gray-700"
              {...register("passwordConfirm")}
            />
          </div>
          {errors.passwordConfirm && (
            <p className="text-sm text-red-500">
              {errors.passwordConfirm.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-400 py-2 text-xl hover:bg-emerald-400 text-white cursor-pointer transition-colors duration-300 disabled:opacity-60"
          >
            {isSubmitting ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="flex justify-end gap-2 text-green-500">
          <p>이미 회원이신가요?</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goSignInPage();
            }}
          >
            <strong className="cursor-pointer hover:text-green-400">
              로그인
            </strong>
          </button>
        </div>

        <div className="absolute top-0 right-0">
          <Image
            src="/hello.png"
            className="w-20 h-20"
            width={40}
            height={40}
            alt="곰 이미지"
          />
        </div>
      </div>
    </div>
  );
}
