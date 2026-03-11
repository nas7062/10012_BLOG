import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PostDetailSkeleton } from "@/src/app/_components/PostDetail/PostDetailSkeleton";

describe("PostDetailSkeleton", () => {
  it("렌더링된다", () => {
    const { container } = render(<PostDetailSkeleton />);
    const wrapper = container.querySelector(".flex.flex-col.gap-10");
    expect(wrapper).toBeInTheDocument();
  });

  it("상단 제목/메타 영역과 본문 영역 구조를 가진다", () => {
    const { container } = render(<PostDetailSkeleton />);
    const sections = container.querySelectorAll(".flex.flex-col.gap-4");
    expect(sections.length).toBeGreaterThanOrEqual(2);
  });
});
