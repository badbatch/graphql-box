import { decode, encode } from "js-base64";
import generateCursorCache from "../__testUtils__/generateCursorCache";
import retrieveCachedConnection from "./retrieveCachedConnection";

describe("retrieveCachedConnection", () => {
  const groupCursor = encode("123456789");
  const resultsPerPage = 10;

  describe("retrieving edges after a cursor", () => {
    test("when 5 cursors on the same page are requested", async () => {
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

    test("when 15 cursors covering multiple pages are requested", async () => {
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

    test("when 15 cursors going over the last page are requested", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 100,
      });

      const args = {
        after: `${encode(`0::10`)}::${groupCursor}`,
        first: 15,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      expect(cachedEdges.length).toBe(9);
      expect(decode(cachedEdges[0].node.id.split("::")[0])).toBe("1::10");
      expect(decode(cachedEdges[cachedEdges.length - 1].node.id.split("::")[0])).toBe("9::10");
      expect(hasPreviousPage).toBe(true);
      expect(hasNextPage).toBe(false);
      expect(missingPages.length).toBe(0);
    });

    describe("when 35 cursors covering multiple pages and going OVER the last page are requested", () => {
      test("when last page has full page of results", async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ["1-10"],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          after: `${encode(`0::8`)}::${groupCursor}`,
          first: 35,
        };

        const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });

        expect(cachedEdges.length).toBe(29);
        expect(decode(cachedEdges[0].node.id.split("::")[0])).toBe("1::8");
        expect(decode(cachedEdges[cachedEdges.length - 1].node.id.split("::")[0])).toBe("9::10");
        expect(hasPreviousPage).toBe(true);
        expect(hasNextPage).toBe(false);
        expect(missingPages.length).toBe(0);
      });

      test("when last page has partial page of results", async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ["1-10"],
          resultsPerPage,
          totalPages: 10,
          totalResults: 96,
        });

        const args = {
          after: `${encode(`0::8`)}::${groupCursor}`,
          first: 35,
        };

        const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });

        expect(cachedEdges.length).toBe(25);
        expect(decode(cachedEdges[0].node.id.split("::")[0])).toBe("1::8");
        expect(decode(cachedEdges[cachedEdges.length - 1].node.id.split("::")[0])).toBe("5::10");
        expect(hasPreviousPage).toBe(true);
        expect(hasNextPage).toBe(false);
        expect(missingPages.length).toBe(0);
      });
    });
  });

  describe("when 25 cursors covering multiple pages and going UP TO the last page are requested", () => {
    test("when last page has full page of results", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 100,
      });

      const args = {
        after: `${encode(`0::8`)}::${groupCursor}`,
        first: 25,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      expect(cachedEdges.length).toBe(25);
      expect(decode(cachedEdges[0].node.id.split("::")[0])).toBe("1::8");
      expect(decode(cachedEdges[cachedEdges.length - 1].node.id.split("::")[0])).toBe("5::10");
      expect(hasPreviousPage).toBe(true);
      expect(hasNextPage).toBe(true);
      expect(missingPages.length).toBe(0);
    });

    test("when last page has partial page of results", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 96,
      });

      const args = {
        after: `${encode(`0::8`)}::${groupCursor}`,
        first: 25,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      expect(cachedEdges.length).toBe(25);
      expect(decode(cachedEdges[0].node.id.split("::")[0])).toBe("1::8");
      expect(decode(cachedEdges[cachedEdges.length - 1].node.id.split("::")[0])).toBe("5::10");
      expect(hasPreviousPage).toBe(true);
      expect(hasNextPage).toBe(true);
      expect(missingPages.length).toBe(0);
    });
  });
});
