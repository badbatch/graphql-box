import { hasNextPage, hasPreviousPage } from "./hasPreviousNextPage";

describe("hasPreviousPage", () => {
  test("when first page number is 1 and start index is 0", () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 1,
      },
    ];

    expect(hasPreviousPage({ cachedEdgesByPage, startIndex: 0 })).toBe(false);
  });

  test("when start index is NOT 0", () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 1,
      },
    ];

    expect(hasPreviousPage({ cachedEdgesByPage, startIndex: 4 })).toBe(true);
  });

  test("when first page number is NOT 1", () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 3,
      },
    ];

    expect(hasPreviousPage({ cachedEdgesByPage, startIndex: 0 })).toBe(true);
  });
});
