import isFirstPage from "./isFirstPage";

describe("isFirstPage", () => {
  test("when page is first page", () => {
    expect(isFirstPage(1)).toBe(true);
  });

  test("when page is NOT first page", () => {
    expect(isFirstPage(5)).toBe(false);
  });
});
