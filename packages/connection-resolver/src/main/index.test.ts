import { Core } from '@cachemap/core';
import { init as map } from '@cachemap/map';
import { type PlainObject } from '@graphql-box/core';
import { expect, jest } from '@jest/globals';
import { GraphQLError, type GraphQLResolveInfo } from 'graphql';
import { encode } from 'js-base64';
import { generateCursorCache } from '../__testUtils__/generateCursorCache.ts';
import { generatePageResponse } from '../__testUtils__/generatePageResponse.ts';
import { removeConnectionInputOptions } from '../helpers/removeConnectionInputOptions.ts';
import { type Getters, type Node, type ResourceResponse } from '../types.ts';
import { makeConnectionResolver } from './index.ts';

const createMakeCursors = (_source: PlainObject, args: PlainObject) => ({
  makeGroupCursor: () => encode(JSON.stringify(removeConnectionInputOptions(args))),
  makeIDCursor: (id: string | number) => encode(`${String(id)}::${JSON.stringify(removeConnectionInputOptions(args))}`),
});

const getters = {
  nodes: ({ results }: PlainObject) => results,
  page: ({ page }: PlainObject) => page,
  totalPages: ({ totalPages }: PlainObject) => totalPages,
  totalResults: ({ totalResults }: PlainObject) => totalResults,
} as Getters<PlainObject, Node>;

const resultsPerPage = 10;

describe('connectionResolver', () => {
  describe('when a cursor is supplied', () => {
    describe('when the cursor is invalid', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _ctx: PlainObject) =>
          ({ page }: { page: number }) =>
            Promise.resolve({ data: { page } }) as unknown as Promise<ResourceResponse<PlainObject>>;

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache: new Core({
            name: 'GRAPHQL_BOX_CONNECTION_RESOLVER',
            store: map(),
            type: 'CONNECTION_RESOLVER',
          }),
          getters,
          resultsPerPage,
        });

        const args = { before: 'abcdefg', first: 5, query: 'Hello world!' };
        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toEqual({
          edges: [],
          errors: [
            new GraphQLError(
              'Invalid connection argument combination. `before` cannot be used in combination with `first`.',
            ),
          ],
          nodes: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
          totalCount: 0,
        });
      });
    });

    describe('when there are NO missing pages in the cache', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _ctx: PlainObject) =>
          ({ page }: { page: number }) =>
            Promise.resolve({ data: { page } }) as unknown as Promise<ResourceResponse<PlainObject>>;

        const groupCursor = encode(JSON.stringify({ query: 'Hello world!' }));

        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache,
          getters,
          resultsPerPage,
        });

        const args = {
          after: `${encode(`0::1`)}::${groupCursor}`,
          first: 5,
          query: 'Hello world!',
        };

        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toMatchSnapshot();
      });
    });

    describe('when there are missing pages in the cache', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });

      const mock = jest
        .fn<(value: number) => Promise<ResourceResponse<PlainObject>>>()
        .mockImplementation(page => pageResponse(page));

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _context: PlainObject, _info: GraphQLResolveInfo) =>
          ({ page }: { page: number }) =>
            mock(page);

        const groupCursor = encode(JSON.stringify({ query: 'Hello world!' }));

        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1', '3-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache,
          getters,
          resultsPerPage,
        });

        const args = {
          after: `${encode(`0::1`)}::${groupCursor}`,
          first: 35,
          query: 'Hello world!',
        };

        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toMatchSnapshot();
      });

      it('should call the resource resolver the correct number of times', () => {
        expect(mock).toHaveBeenCalledTimes(1);
      });

      it('should call the resource resolver with the correct argument', () => {
        expect(mock).toHaveBeenCalledWith(2);
      });
    });
  });

  describe('when the first [X] number are requested', () => {
    describe('when there is a fresh cache and there are NO missing pages in the cache', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _ctx: PlainObject) =>
          ({ page }: { page: number }) =>
            Promise.resolve({ data: { page } }) as unknown as Promise<ResourceResponse<PlainObject>>;

        const groupCursor = encode(JSON.stringify({ query: 'Hello world!' }));

        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache,
          getters,
          resultsPerPage,
        });

        const args = {
          first: 5,
          query: 'Hello world!',
        };

        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toMatchSnapshot();
      });
    });

    describe('when there is a fresh cache and there are missing pages in the cache', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });

      const mock = jest
        .fn<(value: number) => Promise<ResourceResponse<PlainObject>>>()
        .mockImplementation(page => pageResponse(page));

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _context: PlainObject, _info: GraphQLResolveInfo) =>
          ({ page }: { page: number }) =>
            mock(page);

        const groupCursor = encode(JSON.stringify({ query: 'Hello world!' }));

        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['2-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache,
          getters,
          resultsPerPage,
        });

        const args = {
          first: 5,
          query: 'Hello world!',
        };

        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toMatchSnapshot();
      });

      it('should call the resource resolver the correct number of times', () => {
        expect(mock).toHaveBeenCalledTimes(1);
      });

      it('should call the resource resolver with the correct argument', () => {
        expect(mock).toHaveBeenCalledWith(1);
      });
    });

    describe('when there is NOT a fresh cache', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });

      const mock = jest
        .fn<(value: number) => Promise<ResourceResponse<PlainObject>>>()
        .mockImplementation(page => pageResponse(page));

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _context: PlainObject, _info: GraphQLResolveInfo) =>
          ({ page }: { page: number }) =>
            mock(page);

        const cursorCache = new Core({
          name: 'cursorCache',
          store: map(),
          type: 'someType',
        });

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache,
          getters,
          resultsPerPage,
        });

        const args = {
          first: 5,
          query: 'Hello world!',
        };

        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toMatchSnapshot();
      });

      it('should call the resource resolver the correct number of times', () => {
        expect(mock).toHaveBeenCalledTimes(1);
      });

      it('should call the resource resolver with the correct argument', () => {
        expect(mock).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('when the last [X] number are requested', () => {
    describe('when there is a fresh cache and there are NO missing pages in the cache', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _ctx: PlainObject) =>
          async ({ page }: { page: number }) =>
            Promise.resolve({ data: { page } }) as unknown as Promise<ResourceResponse<PlainObject>>;

        const groupCursor = encode(JSON.stringify({ query: 'Hello world!' }));

        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-10'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache,
          getters,
          resultsPerPage,
        });

        const args = {
          last: 5,
          query: 'Hello world!',
        };

        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toMatchSnapshot();
      });
    });

    describe('when there is a fresh cache and there are missing pages in the cache', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });

      const mock = jest
        .fn<(value: number) => Promise<ResourceResponse<PlainObject>>>()
        .mockImplementation(page => pageResponse(page));

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _context: PlainObject, _info: GraphQLResolveInfo) =>
          ({ page }: { page: number }) =>
            mock(page);

        const groupCursor = encode(JSON.stringify({ query: 'Hello world!' }));

        const cursorCache = await generateCursorCache({
          group: groupCursor,
          pageRanges: ['1-9'],
          resultsPerPage,
          totalPages: 10,
          totalResults: 100,
        });

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache,
          getters,
          resultsPerPage,
        });

        const args = {
          last: 5,
          query: 'Hello world!',
        };

        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toMatchSnapshot();
      });

      it('should call the resource resolver the correct number of times', () => {
        expect(mock).toHaveBeenCalledTimes(1);
      });

      it('should call the resource resolver with the correct argument', () => {
        expect(mock).toHaveBeenCalledWith(10);
      });
    });

    describe('when there is NOT a fresh cache', () => {
      let result: Awaited<ReturnType<ReturnType<(typeof import('./index.ts'))['makeConnectionResolver']>>>;
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });

      const mock = jest
        .fn<(value: number) => Promise<ResourceResponse<PlainObject>>>()
        .mockImplementation(page => pageResponse(page));

      beforeAll(async () => {
        const createResourceResolver =
          (_obj: PlainObject, _args: PlainObject, _context: PlainObject, _info: GraphQLResolveInfo) =>
          ({ page }: { page: number }) =>
            mock(page);

        const cursorCache = new Core({
          name: 'cursorCache',
          store: map(),
          type: 'someType',
        });

        const connectionResolver = makeConnectionResolver({
          createMakeCursors,
          createResourceResolver,
          cursorCache,
          getters,
          resultsPerPage,
        });

        const args = {
          last: 5,
          query: 'Hello world!',
        };

        const info = {};
        result = await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      });

      it('should return the correct result', () => {
        expect(result).toMatchSnapshot();
      });

      it('should call the resource resolver the correct number of times', () => {
        expect(mock).toHaveBeenCalledTimes(2);
      });

      it('should call the resource resolver with the correct argument first', () => {
        expect(mock).toHaveBeenNthCalledWith(1, 1);
      });

      it('should call the resource resolver with the correct argument second', () => {
        expect(mock).toHaveBeenNthCalledWith(2, 10);
      });
    });
  });
});
