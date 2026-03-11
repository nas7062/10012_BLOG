import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LogoutButton from "@/src/app/_components/LogoutButton";

const mockSignOut = vi.fn();

vi.mock("next-auth/react", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("로그아웃 버튼이 렌더링된다", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
  });

  it("클릭 시 signOut이 redirectTo '/' 로 호출된다", async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: "로그아웃" }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: "/" });
  });
});
