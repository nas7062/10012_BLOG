import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FollowButton } from "@/src/app/_components/FollowButton";

const mockCheckFollow = vi.fn();
const mockCreateFollow = vi.fn();
const mockDeleteFollow = vi.fn();

vi.mock("@/src/app/_lib/checkFollow", () => ({
  checkFollow: (...args: unknown[]) => mockCheckFollow(...args),
}));

vi.mock("@/src/app/_lib/createFollow", () => ({
  createFollow: (...args: unknown[]) => mockCreateFollow(...args),
}));

vi.mock("@/src/app/_lib/deleteFollow", () => ({
  deleteFollow: (...args: unknown[]) => mockDeleteFollow(...args),
}));

describe("FollowButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckFollow.mockResolvedValue(false);
  });

  it("userId가 없으면 팔로우 버튼만 보인다", async () => {
    render(<FollowButton userId={null} targetId="target-1" />);
    const btn = screen.getByRole("button", { name: "팔로우" });
    expect(btn).toBeInTheDocument();
  });

  it("userId가 있으면 checkFollow로 팔로우 상태를 확인한다", () => {
    render(<FollowButton userId="user-1" targetId="target-1" />);
    expect(mockCheckFollow).toHaveBeenCalledWith("user-1", "target-1");
  });

  it("팔로우 상태가 아니면 클릭 시 createFollow가 호출된다", async () => {
    const user = userEvent.setup();
    mockCheckFollow.mockResolvedValue(false);
    render(<FollowButton userId="user-1" targetId="target-1" />);

    await screen.findByRole("button", { name: "팔로우" });
    await user.click(screen.getByRole("button", { name: "팔로우" }));

    expect(mockCreateFollow).toHaveBeenCalledWith("user-1", "target-1");
  });

  it("팔로우 상태면 버튼이 언팔로우이고, 클릭 시 deleteFollow가 호출된다", async () => {
    const user = userEvent.setup();
    mockCheckFollow.mockResolvedValue(true);
    render(<FollowButton userId="user-1" targetId="target-1" />);

    const btn = await screen.findByRole("button", { name: "언팔로우" });
    await user.click(btn);

    expect(mockDeleteFollow).toHaveBeenCalledWith("user-1", "target-1");
  });
});
