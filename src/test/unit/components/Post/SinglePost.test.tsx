import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SinglePost from "@/src/app/_components/Post/SinglePost";
import type { IPost } from "@/src/types";

const mockToggle = vi.fn();
const mockOpenModal = vi.fn();
const mockPush = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { email: "test@test.com", name: "testuser" } },
    status: "authenticated",
  }),
}));

vi.mock("@/src/hook/usePostLIke", () => ({
  usePostLike: () => ({
    liked: false,
    likeCount: 5,
    toggle: mockToggle,
  }),
}));

vi.mock("@/src/provider/ModalProvider", () => ({
  useModal: () => ({
    openModal: mockOpenModal,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

const mockPost: IPost = {
  id: 1,
  title: "테스트 포스트",
  description: "설명입니다",
  coverImgUrl: "/test.jpg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: "user-1",
  Tags: [],
  reppleCount: 3,
};

describe("SinglePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("포스트 제목과 설명이 렌더링된다", () => {
    render(<SinglePost post={mockPost} />);
    expect(screen.getByText("테스트 포스트")).toBeInTheDocument();
    expect(screen.getByText("설명입니다")).toBeInTheDocument();
  });

  it("좋아요 버튼을 클릭하면 toggle이 호출된다", async () => {
    const user = userEvent.setup();
    render(<SinglePost post={mockPost} />);

    const likeButton = screen.getByRole("button", { name: "좋아요 버튼" });
    await user.click(likeButton);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("좋아요 버튼 클릭 시 카드 클릭으로 이벤트가 전파되지 않는다", async () => {
    const user = userEvent.setup();
    render(<SinglePost post={mockPost} />);

    const likeButton = screen.getByRole("button", { name: "좋아요 버튼" });
    await user.click(likeButton);

    // 좋아요만 호출되고, 라우터 push(상세 이동)는 호출되지 않아야 함
    expect(mockToggle).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("좋아요 개수가 표시된다", () => {
    render(<SinglePost post={mockPost} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
