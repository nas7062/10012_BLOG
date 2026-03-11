import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TagList from "@/src/app/_components/List/TagList";

describe("TagList", () => {
  it("태그 목록이 렌더링된다", () => {
    render(<TagList tags={["react", "next"]} onDelete={vi.fn()} />);
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("next")).toBeInTheDocument();
  });

  it("tags가 없으면 아무것도 렌더하지 않는다", () => {
    const { container } = render(<TagList tags={undefined} onDelete={vi.fn()} />);
    const wrapper = container.querySelector(".flex.gap-2");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.children.length).toBe(0);
  });

  it("태그를 클릭하면 onDelete가 해당 태그 이름으로 호출된다", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TagList tags={["typescript"]} onDelete={onDelete} />);

    await user.click(screen.getByText("typescript"));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("typescript");
  });
});
