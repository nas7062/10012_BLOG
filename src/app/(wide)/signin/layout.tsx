import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "로그인 페이지 | 10012",
  description:
    "10012 정보 공유 플랫폼에 로그인하고 나만의 블로그와 피드를 만들어 보세요.",
  robots: {
    index: false,
    follow: false,
  },
};
export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main data-testid="signin-page"><Suspense fallback={<div>loading...</div>}> {children}</Suspense></main>;
}
