import { CursorCacheEntry } from "../defs";
import isCursorLast from "./isCursorLast";

describe("isCursorLast", () => {
  test("when cursor is last", () => {
    const entry = { index: 2, page: 6 };

    expect(
      isCursorLast({
        direction: "forward",
        entry: entry as CursorCacheEntry,
        resultsPerPage: 10,
        totalPages: 6,
        totalResults: 53,
      }),
    ).toBe(true);
  });

  test("when cursor is NOT last", () => {
    const entry = { index: 0, page: 6 };

    expect(
      isCursorLast({
        direction: "forward",
        entry: entry as CursorCacheEntry,
        resultsPerPage: 10,
        totalPages: 6,
        totalResults: 53,
      }),
    ).toBe(false);
  });
});
