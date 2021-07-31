import { CursorCacheEntry } from "../defs";
import isCursorFirst from "./isCursorFirst";

describe("isCursorFirst", () => {
  test("when cursor is first", () => {
    const entry = { index: 0, page: 1 };
    expect(isCursorFirst({ direction: "backward", entry: entry as CursorCacheEntry })).toBe(true);
  });

  test("when cursor is NOT first", () => {
    const entry = { index: 1, page: 1 };
    expect(isCursorFirst({ direction: "backward", entry: entry as CursorCacheEntry })).toBe(false);
  });
});
