import getCursor from "./getCursor";

describe("getCursor", () => {
  test("when `before` is provided", () => {
    expect(getCursor({ before: "abcdefg" })).toBe("abcdefg");
  });

  test("when `after` is provided", () => {
    expect(getCursor({ after: "abcdefg" })).toBe("abcdefg");
  });
});
