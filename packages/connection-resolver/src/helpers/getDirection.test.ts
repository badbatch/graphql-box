import getDirection from "./getDirection";

describe("getDirection", () => {
  test("when before is provided", () => {
    expect(getDirection("abcdefg")).toBe("backward");
  });

  test("when before is NOT provided", () => {
    expect(getDirection(undefined)).toBe("forward");
  });
});
