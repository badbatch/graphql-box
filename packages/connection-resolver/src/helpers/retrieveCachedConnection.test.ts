import { decode, encode } from "js-base64";
import generateCursorCache from "../__testUtils__/generateCursorCache";
import extractEdges from "./extractEdges";
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

      const edges = extractEdges(cachedEdges);
      expect(edges.length).toBe(5);
      expect(decode((edges[0].node.id as string).split("::")[0])).toBe("1::1");
      expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("5::1");
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

      const edges = extractEdges(cachedEdges);
      expect(edges.length).toBe(15);
      expect(decode((edges[0].node.id as string).split("::")[0])).toBe("6::1");
      expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("0::3");
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

      const edges = extractEdges(cachedEdges);
      expect(edges.length).toBe(9);
      expect(decode((edges[0].node.id as string).split("::")[0])).toBe("1::10");
      expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("9::10");
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

        const edges = extractEdges(cachedEdges);
        expect(edges.length).toBe(29);
        expect(decode((edges[0].node.id as string).split("::")[0])).toBe("1::8");
        expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("9::10");
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

        const edges = extractEdges(cachedEdges);
        expect(edges.length).toBe(25);
        expect(decode((edges[0].node.id as string).split("::")[0])).toBe("1::8");
        expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("5::10");
        expect(hasPreviousPage).toBe(true);
        expect(hasNextPage).toBe(false);
        expect(missingPages.length).toBe(0);
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

        const edges = extractEdges(cachedEdges);
        expect(edges.length).toBe(25);
        expect(decode((edges[0].node.id as string).split("::")[0])).toBe("1::8");
        expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("5::10");
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

        const edges = extractEdges(cachedEdges);
        expect(edges.length).toBe(25);
        expect(decode((edges[0].node.id as string).split("::")[0])).toBe("1::8");
        expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("5::10");
        expect(hasPreviousPage).toBe(true);
        expect(hasNextPage).toBe(false);
        expect(missingPages.length).toBe(0);
      });
    });

    describe("when there are missing pages", () => {
      test("when 35 cursors covering multiple pages and going OVER the last page are requested", async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ["1-8", "10"],
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

        const edges = extractEdges(cachedEdges);
        expect(edges.length).toBe(20);
        expect(decode((edges[0].node.id as string).split("::")[0])).toBe("0::8");
        expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("9::10");
        expect(hasPreviousPage).toBe(true);
        expect(hasNextPage).toBe(false);
        expect(missingPages.length).toBe(1);
        expect(missingPages[0]).toBe(9);
      });

      test("when 25 cursors covering multiple pages and going UP TO the last page are requested", async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ["1-8", "10"],
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

        const edges = extractEdges(cachedEdges);
        expect(edges.length).toBe(20);
        expect(decode((edges[0].node.id as string).split("::")[0])).toBe("0::8");
        expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("9::10");
        expect(hasPreviousPage).toBe(true);
        expect(hasNextPage).toBe(true);
        expect(missingPages.length).toBe(1);
        expect(missingPages[0]).toBe(9);
      });
    });
  });

  describe("retrieving edges before a cursor", () => {
    test("when 5 cursors on the same page are requested", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 100,
      });

      const args = {
        before: `${encode(`9::10`)}::${groupCursor}`,
        last: 5,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      const edges = extractEdges(cachedEdges);
      expect(edges.length).toBe(5);
      expect(decode((edges[0].node.id as string).split("::")[0])).toBe("4::10");
      expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("8::10");
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
        before: `${encode(`9::10`)}::${groupCursor}`,
        last: 15,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      const edges = extractEdges(cachedEdges);
      expect(edges.length).toBe(15);
      expect(decode((edges[0].node.id as string).split("::")[0])).toBe("4::9");
      expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("8::10");
      expect(hasPreviousPage).toBe(true);
      expect(hasNextPage).toBe(true);
      expect(missingPages.length).toBe(0);
    });

    test("when 15 cursors going under the first page are requested", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 100,
      });

      const args = {
        before: `${encode(`9::1`)}::${groupCursor}`,
        last: 15,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      const edges = extractEdges(cachedEdges);
      expect(edges.length).toBe(9);
      expect(decode((edges[0].node.id as string).split("::")[0])).toBe("0::1");
      expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("8::1");
      expect(hasPreviousPage).toBe(false);
      expect(hasNextPage).toBe(true);
      expect(missingPages.length).toBe(0);
    });

    test("when 35 cursors covering multiple pages and going UNDER the first page are requested", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 100,
      });

      const args = {
        before: `${encode(`7::3`)}::${groupCursor}`,
        last: 35,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      const edges = extractEdges(cachedEdges);
      expect(edges.length).toBe(27);
      expect(decode((edges[0].node.id as string).split("::")[0])).toBe("0::1");
      expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("6::3");
      expect(hasPreviousPage).toBe(false);
      expect(hasNextPage).toBe(true);
      expect(missingPages.length).toBe(0);
    });

    test("when 25 cursors covering multiple pages and going DOWN TO the first page are requested", async () => {
      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
        resultsPerPage,
        totalPages: 10,
        totalResults: 100,
      });

      const args = {
        before: `${encode(`7::3`)}::${groupCursor}`,
        last: 25,
      };

      const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      const edges = extractEdges(cachedEdges);
      expect(edges.length).toBe(25);
      expect(decode((edges[0].node.id as string).split("::")[0])).toBe("2::1");
      expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("6::3");
      expect(hasPreviousPage).toBe(true);
      expect(hasNextPage).toBe(true);
      expect(missingPages.length).toBe(0);
    });

    describe("when there are missing pages", () => {
      test("when 35 cursors covering multiple pages and going UNDER the first page are requested", async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ["1", "3-10"],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          before: `${encode(`7::3`)}::${groupCursor}`,
          last: 35,
        };

        const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });

        const edges = extractEdges(cachedEdges);
        expect(edges.length).toBe(20);
        expect(decode((edges[0].node.id as string).split("::")[0])).toBe("0::1");
        expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("9::3");
        expect(hasPreviousPage).toBe(false);
        expect(hasNextPage).toBe(true);
        expect(missingPages.length).toBe(1);
        expect(missingPages[0]).toBe(2);
      });

      test("when 25 cursors covering multiple pages and going DOWN TO the first page are requested", async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ["1", "3-10"],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          before: `${encode(`7::3`)}::${groupCursor}`,
          last: 25,
        };

        const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });

        const edges = extractEdges(cachedEdges);
        expect(edges.length).toBe(20);
        expect(decode((edges[0].node.id as string).split("::")[0])).toBe("0::1");
        expect(decode((edges[edges.length - 1].node.id as string).split("::")[0])).toBe("9::3");
        expect(hasPreviousPage).toBe(true);
        expect(hasNextPage).toBe(true);
        expect(missingPages.length).toBe(1);
        expect(missingPages[0]).toBe(2);
      });
    });
  });
});
