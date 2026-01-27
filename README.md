# 블로그 플랫폼 10012- Frontend

**10012는 여러사람들과 기술과 많은 것들을 공유하는 플랫폼입니다.**

Next.js 16 App Router와 React19,Supabase 기반의 모던 웹 애플리케이션입니다.

## 개발 인원
### 김민석 - 개인 프로젝트


## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [기술 스택](#-기술-스택)
- [주요 기능](#-주요-기능)
- [시작하기](#-시작하기)
- [환경 변수 설정](#-환경-변수-설정)
- [개발 가이드](#-개발-가이드)
- [Path Alias 시스템](#-path-alias-시스템)
- [메타데이터 전략](#-메타데이터-전략)
- [성능 최적화](#-성능-최적화)
- [코딩 컨벤션](#-코딩-컨벤션)


## 🎯 프로젝트 개요

### 비전

사람들과의 내용 및 기술 공유 


## 🛠 기술 스택

### Core Framework

- **Next.js 14.2.18** - React 프레임워크 (App Router, Server Components)
- **React 18** - UI 라이브러리
- **TypeScript 5** - 타입 안전성

### UI/UX

- **Tailwind CSS 3** - 유틸리티 기반 CSS 프레임워크
- **shadcn/ui** - Radix UI 기반 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리
- **Framer Motion** - 애니메이션 라이브러리

### 데이터 시각화
- **Chart.js 4** - 차트 라이브러리
- **react-chartjs-2** - Chart.js React 래퍼

### 데이터 처리
- **React Dropzone** - 드래그 앤 드롭 파일 업로드
- 
### 폼 관리
- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 검증
- **@hookform/resolvers** - React Hook Form + Zod 통합

### 인증 & 백엔드
- **Supabase** - BaaS (Backend as a Service)
  - `@supabase/supabase-js` - Supabase 클라이언트
  - `@supabase/ssr` - SSR 인증 헬퍼

### 개발 도구
- **ESLint** - 코드 품질 검사
- **Prettier** (권장) - 코드 포매팅
- **PostCSS** - CSS 처리

## 주요 화면 
<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d788e74e-5042-4f12-bbc5-1417dcd055ab" width="100%" />
      <br />
      <b>무한 스크롤</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/a487b178-7828-48d3-a27a-8921f9a48cea" width="100%" />
      <br />
      <b>내 게시글 목록</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/b021fd00-a4dd-40c3-9949-31e38817b45e" width="100%" />
      <br />
      <b>상세 페이지 및 댓글기능 </b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e4392667-0004-448b-8a87-1178e443e429b" width="100%" />
      <br />
      <b>글 작성</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/0ec49b0b-89b5-4eb5-b384-1b0df5d24de8" width="100%" />
      <br />
      <b> 정보 수정 및 다크모드 적용 </b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d45bffff-a461-4435-b18f-840ce9beadda" width="100%" />
      <br />
      <b> 뉴스,차트 페이지 </b>
    </td>
  </tr>
</table>




## ✨ 주요 기능

### 1. 인증 시스템

-  Auth.js 인증
  - Kakao OAuth 기반 로그인
  - Creational 회원가입 및 로그인 제공
  - 로그인 시 Supabase authorization · users 테이블에 바로 저장
  - Supabase 연동(유저 정보 저장·조회)
  - 자동 세션 관리(JWT)
-  미들웨어 기반 라우트 보호
  - 인증되지 않은 사용자 자동 리다이렉트
  - 보호 페이지 접근 제어

### 2. 게시글(Post) 기능

-  CRUD 기능
  - 게시글 생성 / 수정 / 삭제 / 조회
  - 게시글 전체 목록 페이지 제공
  - 게시글 상세 페이지(detail) 제공

-  유저별 게시글 페이지
  - 유저 프로필 클릭 시 해당 유저의 Posts 모아보기
  - 태그(tag)별 필터링 가능
  - 태그 클릭 시 query 기반 필터링 적용

### 3. 댓글(Comment) 기능
-  댓글 CRUD
  - 게시글 상세 페이지에서 댓글 생성 가능
  - 댓글 수정 / 삭제 가능
  - 실시간 반영 구조로 UX 안정화

### 4. 좋아요(Like) 기능
-  토글 기반 좋아요 시스템
  - React Query(useMutation)으로 좋아요 옵티미스틱한  업데이트 상태 관리
  - 좋아요 목록(좋아요한 게시글만 보는 페이지) 제공

### 5. 무한 스크롤
 Infinite Scroll
  - homePage와 searchPage,newsPage에서 무한 스크롤 적용
  - useInfiniteQuery 기반 리스트 페이지 무한 스크롤 구현

### 7. 파일 업로드
-  파일 업로드 기능
  - React Dropzone 사용
  - 업로드 파일을 Supabase Storage에 저장

### 7. 차트(Charts)
-  NPM 다운로드 차트
  - 백엔드 / 프론트엔드 다운로드 카운트 수집
  - 이를 차트 형태로 시각화
### 8. 뉴스 페이지
-  News Feed
  - 최신 뉴스 제공하는 전용 페이지 구성

### 9. 설정(Setting)
-  다크 모드
  - next-themes 기반 라이트/다크 모드 토글 지원
  - 유저 정보 변경 가능 (이미지,이름,설명)
  - 유저 탈퇴 기능
### 7. UI/UX

-  **반응형 디자인**
  - 모바일, 태블릿, 데스크톱 최적화
  - Tailwind Breakpoints 활용
-  **네비게이션**
  - 반응형 헤더 (Desktop/Mobile)
  - 인증 상태 기반 메뉴
  - 사용자 드롭다운
-  **SEO 최적화**
  - 페이지별 메타데이터
  - 검색 엔진 제어 (noindex/nofollow)
  - OpenGraph 태그

## 🚀 시작하기

### 사전 요구사항

- **Node.js 20+**
- **npm 또는 yarn**
- **Supabase 계정** (https://supabase.com)

### 설치 및 실행

1. **의존성 설치**

```bash
npm install
```

2. **환경 변수 설정**

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Supabase 프로젝트 설정에서 URL과 anon key를 확인할 수 있습니다.

3. **개발 서버 실행**

```bash
npm run dev
```

4. **브라우저에서 열기**
```
http://localhost:3000
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 타입 체크
npm run type-check

# 린트
npm run lint
```

## 🔐 환경 변수 설정

### 필수 환경 변수

| 변수명                          | 설명                  | 예시                                      |
| ------------------------------- | --------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase 프로젝트 URL | `https://xxxxx.supabase.co`               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key     | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 환경별 설정

- **개발 환경**: `.env.local`
- **프로덕션 환경**: Vercel 대시보드에서 환경 변수 설정

## 💻 개발 가이드

### Path Alias 시스템

TypeScript path alias를 사용하여 깔끔한 import를 지원합니다.

**tsconfig.json 설정**:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
    }
  }
}
```

**사용 예시**:

```typescript
// ❌ 상대 경로 (복잡함)
import { Button } from "../../../src/components/ui/button";

// ✅ Path Alias (깔끔함)
import { Button } from "@/components/ui/button";
import { createClient } from "@/backend/supabase/client";
```

**Path Alias 규칙**:

- `@/*` → `./src/*` (모든 소스 코드)

### 컴포넌트 작성 가이드

**Client Component**:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function MyComponent() {
  const [count, setCount] = useState(0);

  return <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>;
}
```

**Server Component** (기본값):

```tsx
import { createClient } from "@/backend/supabase/server";

export default async function ServerComponent() {
  const supabase = createClient();
  const { data } = await supabase.from("users").select();

  return <div>{/* 렌더링 */}</div>;
}
```

### 스타일링 가이드

**Tailwind CSS 클래스**:

```tsx
<div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md">
  <Button variant="default" size="lg">
    Click Me
  </Button>
</div>
```




## 📊 메타데이터 전략

### 메타데이터 구조

각 페이지에 `layout.tsx` 파일을 추가하여 메타데이터를 정의합니다.

**공개 페이지** (홈, 로그인):

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "10012",
  description: "10012 블로그",
  keywords: ["10012", "블로그"],
  openGraph: {
    title: "10012 블로그",
    description: "...",
    images: ["/og-image.jpg"],
  },
};
```

**비공개 페이지** (피드/ 글 쓰기 / 수정 / 설정 페이지):

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "피드 | 10012",
  description: "나만의 피드를 확인",
  robots: {
    index: false, // 검색 엔진 색인 방지
    follow: false, // 링크 추적 방지
  },
};
```

### SEO 전략

- **공개 페이지**: 검색 엔진 최적화 (OpenGraph, keywords)
- **비공개 페이지**: 검색 엔진 제외 (`noindex, nofollow`)
- **개인정보 보호**: 사용자 데이터가 포함된 페이지는 색인 방지

## 📝  성능 최적화
<img width="1896" height="982" alt="LightHouse " src="https://github.com/user-attachments/assets/d8ba8fa6-5505-4be6-af87-2432df95de44" />

### 1. 이미지 최적화
- `sizes` 속성 최적화로 적절한 이미지 크기 로드
- `quality={85}` 설정으로 이미지 품질과 파일 크기 균형
- `placeholder="blur"` 및 `blurDataURL` 추가로 레이아웃 시프트 감소
- `object-cover` 클래스 추가로 이미지 표시 최적화
- `loading="lazy"` 설정
- priority 설정을 통한 LCP 개선
- 

### 2. Next.js 설정 최적화

####  `next.config.ts` 개선

- **deprecated `domains` 제거**: `remotePatterns`로 통합
- **이미지 최적화 옵션**:
  - `deviceSizes`: 다양한 디바이스 크기 지원
  - `formats`: 이미지 avif or webp로 변환
  - `imageSizes`: 적절한 이미지 크기 정의
  - `minimumCacheTTL: 60`: 캐시 TTL 설정
- **성능 옵션**:
  - `compress: true`: Gzip 압축 활성화
  - `poweredByHeader: false`: 보안 개선
  - `reactStrictMode: true`: React 엄격 모드
  - `swcMinify: true`: SWC로 빠른 빌드
  - `experimental.optimizeCss: true`: CSS 최적화

### 3. 폰트 최적화

####  Font Loading 전략

- `display: "swap"`: 폰트 로딩 중 텍스트 표시 (FOUT)
- `adjustFontFallback: true`: 폰트 로딩 실패 시 폴백 최적화
- `variable` 추가: CSS 변수로 폰트 관리
- 적절한 `fallback` 폰트 설정

### 4. 메타데이터 및 SEO 최적화

####  Layout 메타데이터

- `viewport` 설정 최적화
- `metadataBase` 추가로 절대 URL 설정
- OpenGraph 메타데이터 추가

### 5. 컴포넌트 최적화

####  Post 컴포넌트
- `React.memo` 적용으로 불필요한 리렌더링 방지
- `useCallback`으로 함수 메모이제이션
- 이벤트 핸들러 최적화

####  동적 임포트 (Code Splitting)
-  View,Header 등 무거운 컴포넌트: MDEditor를 동적 임포트로 지연 로딩
- `ssr: false`로 클라이언트 사이드만 로드
- 로딩 스켈레톤 추가

### 6. Main Page LCP 개선
- 초기 화면에 필요한 게시글을 서버에서 미리 렌더링해 전달함으로써,
클라이언트 측 추가 요청 없이 즉시 콘텐츠가 표시되도록 하여 LCP를 개선했습니다.


## 📝 코딩 컨벤션

### 파일명

- **컴포넌트**: PascalCase (예: `MyComponent.tsx`)
- **유틸리티**: camelCase (예: `chartUtils.ts`)
- **페이지**: 소문자 (예: `page.tsx`, `layout.tsx`)

### 컴포넌트

- 함수형 컴포넌트 사용
- Client Component는 `"use client"` 명시
- Server Component가 기본값

### 타입

- TypeScript `interface` 우선
- `type`은 유니온, 교차 타입에 사용
- Zod 스키마로 런타임 검증

### 스타일

- Tailwind CSS 클래스 사용
- shadcn/ui 컴포넌트 활용
- 커스텀 스타일은 `globals.css`에 정의

### 주석

- 복잡한 로직에만 한글 주석
- JSDoc 형식으로 함수 설명
- 
