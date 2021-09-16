import { decode, encode } from "js-base64";
import generateCursorCache from "../__testUtils__/generateCursorCache";
import retrieveCachedConnection from "./retrieveCachedConnection";

describe("retrieveCachedConnection", () => {
  const groupCursor = encode("123456789");
  const resultsPerPage = 10;

  describe("retrieving edges after a cursor", () => {
    test("when 5 cursors on the first page are returned", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 100,
      });

      const args = {
        after: `${encode(`0::1`)}::${groupCursor}`,
        first: 5,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      expect(cachedEdges.length).toBe(5);
      expect(decode(cachedEdges[0].node.id.split("::")[0])).toBe("1::1");
      expect(decode(cachedEdges[cachedEdges.length - 1].node.id.split("::")[0])).toBe("5::1");
      expect(hasPreviousPage).toBe(true);
      expect(hasNextPage).toBe(true);
      expect(missingPages.length).toBe(0);
    });

    test("when 15 cursors covering multiple pages are returned", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 100,
      });

      const args = {
        after: `${encode(`5::1`)}::${groupCursor}`,
        first: 15,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      expect(cachedEdges.length).toBe(15);
      expect(decode(cachedEdges[0].node.id.split("::")[0])).toBe("6::1");
      expect(decode(cachedEdges[cachedEdges.length - 1].node.id.split("::")[0])).toBe("0::3");
      expect(hasPreviousPage).toBe(true);
      expect(hasNextPage).toBe(true);
      expect(missingPages.length).toBe(0);
    });
  });
});
