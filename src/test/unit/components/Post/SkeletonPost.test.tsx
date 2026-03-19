import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkeletonPost } from "@/src/app/_components/Post/SkeletonPost";

describe("SkeletonPost", () => {
  it("렌더링된다", () => {
    render(<SkeletonPost />);
    const wrapper = document.querySelector(".flex.flex-col");
    expect(wrapper).toBeInTheDocument();
  });

  it("스켈레톤 레이아웃 구조를 가진다", () => {
    const { container } = render(<SkeletonPost />);
    const imageArea = container.querySelector(".relative.w-full.h-60");
    expect(imageArea).toBeInTheDocument();
    const contentArea = container.querySelector(".px-4.flex.flex-col");
    expect(contentArea).toBeInTheDocument();
  });
});
