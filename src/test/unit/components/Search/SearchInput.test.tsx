import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SearchInput from "@/src/app/(wide)/search/_components/SearchInput";

describe("SearchInput", () => {
  it("검색 폼이 action /search, method GET으로 렌더링된다", () => {
    const { container } = render(<SearchInput q="" />);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("action", "/search");
    expect(form?.getAttribute("method")?.toLowerCase()).toBe("get");
  });

  it("검색어 입력 필드와 검색 버튼이 있다", () => {
    render(<SearchInput q="" />);
    expect(screen.getByPlaceholderText("검색어 입력")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "검색" })).toBeInTheDocument();
  });

  it("q prop이 input defaultValue로 적용된다", () => {
    render(<SearchInput q="nextjs" />);
    const input = screen.getByPlaceholderText("검색어 입력");
    expect(input).toHaveAttribute("name", "q");
    expect(input).toHaveValue("nextjs");
  });
});
