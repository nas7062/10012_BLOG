import { auth } from "@/src/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // 0) 정적 파일 / 이미지 요청은 무조건 패스
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(pathname);

  if (isStaticAsset) {
    return NextResponse.next();
  }
  // path segment 분리: "/a/b" -> ["a","b"]
  const segments = pathname.split("/").filter(Boolean);
  // 1) 로그인/회원/세팅 관련 페이지
  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  const reserved = ["signin", "signup", "setting", "news", "feed", "chart"];

  // 2) 동적 공개 페이지들
  //   - /[name]/[postid]
  const isPostDetailPage =
    segments.length === 2 &&
    segments[0] &&
    segments[1] &&
    // /signin, /news 같은 고정 라우트랑 안 겹치게
    !reserved.includes(segments[0]) &&
    segments[1] !== "posts";

  //   - /[userid]/posts
  const isUserPostsPage =
    segments.length === 2 &&
    segments[0] &&
    segments[1] === "posts" &&
    !reserved.includes(segments[0]);
  const isUserFollowerPage =
    segments.length === 2 &&
    segments[0] &&
    segments[1] === "follower" &&
    !reserved.includes(segments[0]);

  const isUserFollowingPage =
    segments.length === 2 &&
    segments[0] &&
    segments[1] === "following" &&
    !reserved.includes(segments[0]);

  // 3) 공개 페이지 (로그인 필요 없음)
  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/news") ||
    pathname.startsWith("/chart") ||
    pathname.startsWith("/search") ||
    isPostDetailPage ||
    isUserPostsPage ||
    isUserFollowingPage ||
    isUserFollowerPage;

  // 이미 로그인했는데 로그인/회원 페이지로 가면 → 메인으로 보냄
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // 로그인 안 했고, 보호된 페이지로 가면 → 로그인 페이지로 리다이렉트
  if (!isLoggedIn && !isPublicPage && !isAuthPage) {
    const loginUrl = new URL("/signin", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 그 외에는 통과
  return NextResponse.next();
});

// 3) 미들웨어가 너무 많이 도는 것 방지 (정적/이미지 등 제외)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
