// src/test/setup.ts
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";
import type { ImgHTMLAttributes } from "react";

// 각 테스트 후 정리
afterEach(() => {
  cleanup();
});

// Next.js Image 컴포넌트 모킹 (blurDataURL 등 DOM에 없는 prop 제거)
vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const { blurDataURL, ...imgProps } = props as ImgHTMLAttributes<HTMLImageElement> & { blurDataURL?: string };
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement("img", imgProps);
  },
}));

// Next.js Link 컴포넌트 모킹
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement("a", { href }, children);
  },
}));

// Next.js navigation 모킹 (필요한 경우)
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));