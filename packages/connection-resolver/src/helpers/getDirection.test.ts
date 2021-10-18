import getDirection from "./getDirection";

describe("getDirection", () => {
  test("when last is provided", () => {
    expect(getDirection(5)).toBe("backward");
  });

  test("when last is NOT provided", () => {
    expect(getDirection(undefined)).toBe("forward");
  });
});
