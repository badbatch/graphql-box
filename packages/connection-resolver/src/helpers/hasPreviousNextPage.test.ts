import { hasNextPage, hasPreviousPage } from "./hasPreviousNextPage";

describe("hasPreviousPage", () => {
  test("when first page number is 1 and start index is 0", () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 1,
      },
    ];

    const startIndex = { absolute: 0, relative: 0 };
    expect(hasPreviousPage({ cachedEdgesByPage, startIndex })).toBe(false);
  });

  test("when start index is NOT 0", () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 1,
      },
    ];

    const startIndex = { absolute: 5, relative: 5 };
    expect(hasPreviousPage({ cachedEdgesByPage, startIndex })).toBe(true);
  });

  test("when first page number is NOT 1", () => {
    const cachedEdgesByPage = [
      {
        edges: [],
        pageNumber: 3,
      },
    ];

    const startIndex = { absolute: 0, relative: 0 };
    expect(hasPreviousPage({ cachedEdgesByPage, startIndex })).toBe(true);
  });
});
