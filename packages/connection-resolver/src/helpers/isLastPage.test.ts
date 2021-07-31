import isLastPage from "./isLastPage";

describe("isLastPage", () => {
  test("when page is last page", () => {
    expect(isLastPage({ page: 5, totalPages: 5 })).toBe(true);
  });

  test("when page is NOT last page", () => {
    expect(isLastPage({ page: 4, totalPages: 5 })).toBe(false);
  });
});
