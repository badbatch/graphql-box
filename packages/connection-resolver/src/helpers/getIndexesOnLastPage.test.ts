import getIndexesOnLastPage from "./getIndexesOnLastPage";

describe("getIndexesOnLastPage", () => {
  test("when results on last page equal results per page", () => {
    expect(getIndexesOnLastPage({ resultsPerPage: 10, totalResults: 50 })).toBe(9);
  });

  test("when results on last page do NOT equal results per page", () => {
    expect(getIndexesOnLastPage({ resultsPerPage: 10, totalResults: 53 })).toBe(2);
  });
});
