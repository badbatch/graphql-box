import getIndexesOnCurrentPage from "./getIndexesOnCurrentPage";

describe("getIndexesOnCurrentPage", () => {
  test("when current page is last page", () => {
    expect(
      getIndexesOnCurrentPage({ metadata: { totalPages: 6, totalResults: 53 }, page: 6, resultsPerPage: 10 }),
    ).toBe(2);
  });

  test("when current page is NOT last page", () => {
    expect(
      getIndexesOnCurrentPage({ metadata: { totalPages: 6, totalResults: 53 }, page: 5, resultsPerPage: 10 }),
    ).toBe(9);
  });
});
