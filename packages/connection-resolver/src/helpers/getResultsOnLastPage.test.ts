import getResultsOnLastPage from "./getResultsOnLastPage";

describe("getResultsOnLastPage", () => {
  test("when results on last page equal results per page", () => {
    expect(getResultsOnLastPage({ resultsPerPage: 10, totalResults: 50 })).toBe(10);
  });

  test("when results on last page do NOT equal results per page", () => {
    expect(getResultsOnLastPage({ resultsPerPage: 10, totalResults: 53 })).toBe(3);
  });
});
