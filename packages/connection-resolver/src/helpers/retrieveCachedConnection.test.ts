import { expect } from '@jest/globals';
import { decode, encode } from 'js-base64';
import { generateCursorCache } from '../__testUtils__/generateCursorCache.ts';
import { extractEdges } from './extractEdges.ts';
import { retrieveCachedConnection } from './retrieveCachedConnection.ts';

describe('retrieveCachedConnection', () => {
  const groupCursor = encode('123456789');
  const resultsPerPage = 10;

  describe('retrieving edges after a cursor', () => {
    describe('when 5 cursors on the same page are requested', () => {
      let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

      beforeAll(async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          after: `${encode(`0::1`)}::${groupCursor}`,
          first: 5,
        };

        result = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });
      });

      it('should return the correct number of edges', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(edges).toHaveLength(5);
      });

      it('should return the correct first edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('1::1');
      });

      it('should return the correct last edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('5::1');
      });

      it('should return hasPreviousPage as true', () => {
        expect(result.hasPreviousPage).toBe(true);
      });

      it('should return hasNextPage as true', () => {
        expect(result.hasNextPage).toBe(true);
      });

      it('should return no missing pages', () => {
        expect(result.missingPages).toHaveLength(0);
      });
    });

    describe('when 15 cursors covering multiple pages are requested', () => {
      let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

      beforeAll(async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          after: `${encode(`5::1`)}::${groupCursor}`,
          first: 15,
        };

        result = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });
      });

      it('should return the correct number of edges', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(edges).toHaveLength(15);
      });

      it('should return the correct first edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('6::1');
      });

      it('should return the correct last edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('0::3');
      });

      it('should return hasPreviousPage as true', () => {
        expect(result.hasPreviousPage).toBe(true);
      });

      it('should return hasNextPage as true', () => {
        expect(result.hasNextPage).toBe(true);
      });

      it('should return no missing pages', () => {
        expect(result.missingPages).toHaveLength(0);
      });
    });

    describe('when 15 cursors going over the last page are requested', () => {
      let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

      beforeAll(async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          after: `${encode(`0::10`)}::${groupCursor}`,
          first: 15,
        };

        result = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });
      });

      it('should return the correct number of edges', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(edges).toHaveLength(9);
      });

      it('should return the correct first edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('1::10');
      });

      it('should return the correct last edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('9::10');
      });

      it('should return hasPreviousPage as true', () => {
        expect(result.hasPreviousPage).toBe(true);
      });

      it('should return hasNextPage as false', () => {
        expect(result.hasNextPage).toBe(false);
      });

      it('should return no missing pages', () => {
        expect(result.missingPages).toHaveLength(0);
      });
    });

    describe('when 35 cursors covering multiple pages and going OVER the last page are requested', () => {
      describe('when last page has full page of results', () => {
        let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

        beforeAll(async () => {
          const cursorCache = await generateCursorCache({
            group: groupCursor,
            pageRanges: ['1-10'],
            resultsPerPage,
            totalPages: 10,
            totalResults: 100,
          });

          const args = {
            after: `${encode(`0::8`)}::${groupCursor}`,
            first: 35,
          };

          result = await retrieveCachedConnection(args, {
            cursorCache,
            groupCursor,
            resultsPerPage,
          });
        });

        it('should return the correct number of edges', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(edges).toHaveLength(29);
        });

        it('should return the correct first edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('1::8');
        });

        it('should return the correct last edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('9::10');
        });

        it('should return hasPreviousPage as true', () => {
          expect(result.hasPreviousPage).toBe(true);
        });

        it('should return hasNextPage as false', () => {
          expect(result.hasNextPage).toBe(false);
        });

        it('should return no missing pages', () => {
          expect(result.missingPages).toHaveLength(0);
        });
      });

      describe('when last page has partial page of results', () => {
        let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

        beforeAll(async () => {
          const cursorCache = await generateCursorCache({
            group: groupCursor,
            pageRanges: ['1-10'],
            resultsPerPage,
            totalPages: 10,
            totalResults: 96,
          });

          const args = {
            after: `${encode(`0::8`)}::${groupCursor}`,
            first: 35,
          };

          result = await retrieveCachedConnection(args, {
            cursorCache,
            groupCursor,
            resultsPerPage,
          });
        });

        it('should return the correct number of edges', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(edges).toHaveLength(25);
        });

        it('should return the correct first edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('1::8');
        });

        it('should return the correct last edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('5::10');
        });

        it('should return hasPreviousPage as true', () => {
          expect(result.hasPreviousPage).toBe(true);
        });

        it('should return hasNextPage as false', () => {
          expect(result.hasNextPage).toBe(false);
        });

        it('should return no missing pages', () => {
          expect(result.missingPages).toHaveLength(0);
        });
      });
    });

    describe('when 25 cursors covering multiple pages and going UP TO the last page are requested', () => {
      describe('when last page has full page of results', () => {
        let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

        beforeAll(async () => {
          const cursorCache = await generateCursorCache({
            group: groupCursor,
            pageRanges: ['1-10'],
            resultsPerPage,
            totalPages: 10,
            totalResults: 100,
          });

          const args = {
            after: `${encode(`0::8`)}::${groupCursor}`,
            first: 25,
          };

          result = await retrieveCachedConnection(args, {
            cursorCache,
            groupCursor,
            resultsPerPage,
          });
        });

        it('should return the correct number of edges', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(edges).toHaveLength(25);
        });

        it('should return the correct first edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('1::8');
        });

        it('should return the correct last edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('5::10');
        });

        it('should return hasPreviousPage as true', () => {
          expect(result.hasPreviousPage).toBe(true);
        });

        it('should return hasNextPage as true', () => {
          expect(result.hasNextPage).toBe(true);
        });

        it('should return no missing pages', () => {
          expect(result.missingPages).toHaveLength(0);
        });
      });

      describe('when last page has partial page of results', () => {
        let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

        beforeAll(async () => {
          const cursorCache = await generateCursorCache({
            group: groupCursor,
            pageRanges: ['1-10'],
            resultsPerPage,
            totalPages: 10,
            totalResults: 96,
          });

          const args = {
            after: `${encode(`0::8`)}::${groupCursor}`,
            first: 25,
          };

          result = await retrieveCachedConnection(args, {
            cursorCache,
            groupCursor,
            resultsPerPage,
          });
        });

        it('should return the correct number of edges', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(edges).toHaveLength(25);
        });

        it('should return the correct first edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('1::8');
        });

        it('should return the correct last edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('5::10');
        });

        it('should return hasPreviousPage as true', () => {
          expect(result.hasPreviousPage).toBe(true);
        });

        it('should return hasNextPage as false', () => {
          expect(result.hasNextPage).toBe(false);
        });

        it('should return no missing pages', () => {
          expect(result.missingPages).toHaveLength(0);
        });
      });
    });

    describe('when there are missing pages', () => {
      describe('when 35 cursors covering multiple pages and going OVER the last page are requested', () => {
        let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

        beforeAll(async () => {
          const cursorCache = await generateCursorCache({
            group: groupCursor,
            pageRanges: ['1-8', '10'],
            resultsPerPage,
            totalPages: 10,
            totalResults: 100,
          });

          const args = {
            after: `${encode(`0::8`)}::${groupCursor}`,
            first: 35,
          };

          result = await retrieveCachedConnection(args, {
            cursorCache,
            groupCursor,
            resultsPerPage,
          });
        });

        it('should return the correct number of edges', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(edges).toHaveLength(20);
        });

        it('should return the correct first edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('0::8');
        });

        it('should return the correct last edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('9::10');
        });

        it('should return hasPreviousPage as true', () => {
          expect(result.hasPreviousPage).toBe(true);
        });

        it('should return hasNextPage as false', () => {
          expect(result.hasNextPage).toBe(false);
        });

        it('should return the missing pages', () => {
          expect(result.missingPages).toEqual([9]);
        });
      });

      describe('when 25 cursors covering multiple pages and going UP TO the last page are requested', () => {
        let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

        beforeAll(async () => {
          const cursorCache = await generateCursorCache({
            group: groupCursor,
            pageRanges: ['1-8', '10'],
            resultsPerPage,
            totalPages: 10,
            totalResults: 100,
          });

          const args = {
            after: `${encode(`0::8`)}::${groupCursor}`,
            first: 25,
          };

          result = await retrieveCachedConnection(args, {
            cursorCache,
            groupCursor,
            resultsPerPage,
          });
        });

        it('should return the correct number of edges', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(edges).toHaveLength(20);
        });

        it('should return the correct first edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('0::8');
        });

        it('should return the correct last edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('9::10');
        });

        it('should return hasPreviousPage as true', () => {
          expect(result.hasPreviousPage).toBe(true);
        });

        it('should return hasNextPage as true', () => {
          expect(result.hasNextPage).toBe(true);
        });

        it('should return the missing pages', () => {
          expect(result.missingPages).toEqual([9]);
        });
      });
    });
  });

  describe('retrieving edges before a cursor', () => {
    describe('when 5 cursors on the same page are requested', () => {
      let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

      beforeAll(async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          before: `${encode(`9::10`)}::${groupCursor}`,
          last: 5,
        };

        result = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });
      });

      it('should return the correct number of edges', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(edges).toHaveLength(5);
      });

      it('should return the correct first edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('4::10');
      });

      it('should return the correct last edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('8::10');
      });

      it('should return hasPreviousPage as true', () => {
        expect(result.hasPreviousPage).toBe(true);
      });

      it('should return hasNextPage as true', () => {
        expect(result.hasNextPage).toBe(true);
      });

      it('should return no missing pages', () => {
        expect(result.missingPages).toHaveLength(0);
      });
    });

    describe('when 15 cursors covering multiple pages are requested', () => {
      let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

      beforeAll(async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          before: `${encode(`9::10`)}::${groupCursor}`,
          last: 15,
        };

        result = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });
      });

      it('should return the correct number of edges', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(edges).toHaveLength(15);
      });

      it('should return the correct first edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('4::9');
      });

      it('should return the correct last edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('8::10');
      });

      it('should return hasPreviousPage as true', () => {
        expect(result.hasPreviousPage).toBe(true);
      });

      it('should return hasNextPage as true', () => {
        expect(result.hasNextPage).toBe(true);
      });

      it('should return no missing pages', () => {
        expect(result.missingPages).toHaveLength(0);
      });
    });

    describe('when 15 cursors going under the first page are requested', () => {
      let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

      beforeAll(async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          before: `${encode(`9::1`)}::${groupCursor}`,
          last: 15,
        };

        result = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });
      });

      it('should return the correct number of edges', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(edges).toHaveLength(9);
      });

      it('should return the correct first edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('0::1');
      });

      it('should return the correct last edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('8::1');
      });

      it('should return hasPreviousPage as false', () => {
        expect(result.hasPreviousPage).toBe(false);
      });

      it('should return hasNextPage as true', () => {
        expect(result.hasNextPage).toBe(true);
      });

      it('should return no missing pages', () => {
        expect(result.missingPages).toHaveLength(0);
      });
    });

    describe('when 35 cursors covering multiple pages and going UNDER the first page are requested', () => {
      let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

      beforeAll(async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          before: `${encode(`7::3`)}::${groupCursor}`,
          last: 35,
        };

        result = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });
      });

      it('should return the correct number of edges', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(edges).toHaveLength(27);
      });

      it('should return the correct first edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('0::1');
      });

      it('should return the correct last edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('6::3');
      });

      it('should return hasPreviousPage as false', () => {
        expect(result.hasPreviousPage).toBe(false);
      });

      it('should return hasNextPage as true', () => {
        expect(result.hasNextPage).toBe(true);
      });

      it('should return no missing pages', () => {
        expect(result.missingPages).toHaveLength(0);
      });
    });

    describe('when 25 cursors covering multiple pages and going DOWN TO the first page are requested', () => {
      let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

      beforeAll(async () => {
        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const args = {
          before: `${encode(`7::3`)}::${groupCursor}`,
          last: 25,
        };

        result = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });
      });

      it('should return the correct number of edges', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(edges).toHaveLength(25);
      });

      it('should return the correct first edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('2::1');
      });

      it('should return the correct last edge', () => {
        const edges = extractEdges(result.cachedEdges);
        expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('6::3');
      });

      it('should return hasPreviousPage as true', () => {
        expect(result.hasPreviousPage).toBe(true);
      });

      it('should return hasNextPage as true', () => {
        expect(result.hasNextPage).toBe(true);
      });

      it('should return no missing pages', () => {
        expect(result.missingPages).toHaveLength(0);
      });
    });

    describe('when there are missing pages', () => {
      describe('when 35 cursors covering multiple pages and going UNDER the first page are requested', () => {
        let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

        beforeAll(async () => {
          const cursorCache = await generateCursorCache({
            group: groupCursor,
            pageRanges: ['1', '3-10'],
            resultsPerPage,
            totalPages: 10,
            totalResults: 100,
          });

          const args = {
            before: `${encode(`7::3`)}::${groupCursor}`,
            last: 35,
          };

          result = await retrieveCachedConnection(args, {
            cursorCache,
            groupCursor,
            resultsPerPage,
          });
        });

        it('should return the correct number of edges', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(edges).toHaveLength(20);
        });

        it('should return the correct first edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('0::1');
        });

        it('should return the correct last edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('9::3');
        });

        it('should return hasPreviousPage as false', () => {
          expect(result.hasPreviousPage).toBe(false);
        });

        it('should return hasNextPage as true', () => {
          expect(result.hasNextPage).toBe(true);
        });

        it('should return the missing pages', () => {
          expect(result.missingPages).toEqual([2]);
        });
      });

      describe('when 25 cursors covering multiple pages and going DOWN TO the first page are requested', () => {
        let result: Awaited<ReturnType<(typeof import('./retrieveCachedConnection.ts'))['retrieveCachedConnection']>>;

        beforeAll(async () => {
          const cursorCache = await generateCursorCache({
            group: groupCursor,
            pageRanges: ['1', '3-10'],
            resultsPerPage,
            totalPages: 10,
            totalResults: 100,
          });

          const args = {
            before: `${encode(`7::3`)}::${groupCursor}`,
            last: 25,
          };

          result = await retrieveCachedConnection(args, {
            cursorCache,
            groupCursor,
            resultsPerPage,
          });
        });

        it('should return the correct number of edges', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(edges).toHaveLength(20);
        });

        it('should return the correct first edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges[0]!.node.id as string).split('::')[0]!)).toBe('0::1');
        });

        it('should return the correct last edge', () => {
          const edges = extractEdges(result.cachedEdges);
          expect(decode((edges.at(-1)!.node.id as string).split('::')[0]!)).toBe('9::3');
        });

        it('should return hasPreviousPage as true', () => {
          expect(result.hasPreviousPage).toBe(true);
        });

        it('should return hasNextPage as true', () => {
          expect(result.hasNextPage).toBe(true);
        });

        it('should return the missing pages', () => {
          expect(result.missingPages).toEqual([2]);
        });
      });
    });
  });
});
