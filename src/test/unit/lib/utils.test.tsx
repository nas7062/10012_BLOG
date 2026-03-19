import { describe, it, expect } from "vitest";
import { cn } from "@/src/lib/utils";

describe("cn (utils)", () => {
  it("단일 클래스 문자열을 그대로 반환한다", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("여러 클래스를 합친다", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("조건부 클래스를 적용한다", () => {
    expect(cn("base", false && "hidden", true && "block")).toBe("base block");
  });

  it("tailwind 충돌 시 나중 클래스가 우선한다", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("빈 값은 무시한다", () => {
    expect(cn("a", undefined, null, false, "b")).toBe("a b");
  });
});
