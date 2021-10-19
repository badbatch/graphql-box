import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { encode } from "js-base64";
import makeConnectionResolver from ".";
import generateCursorCache from "../__testUtils__/generateCursorCache";
import generatePageResponse from "../__testUtils__/generatePageResponse";
import { PlainObject } from "../defs";
import removeConnectionInputOptions from "../helpers/removeConnectionInputOptions";

describe("connectionResolver", () => {
  const createMakeCursors = (_source: PlainObject, args: PlainObject) => ({
    makeGroupCursor: () => encode(JSON.stringify(removeConnectionInputOptions(args))),
    makeIDCursor: (id: string | number) => encode(`${id}::${JSON.stringify(removeConnectionInputOptions(args))}`),
  });

  const getters = {
    nodes: ({ results }: PlainObject) => results,
    page: ({ page }: PlainObject) => page,
    totalPages: ({ totalPages }: PlainObject) => totalPages,
    totalResults: ({ totalResults }: PlainObject) => totalResults,
  };

  const resultsPerPage = 10;

  describe("when a cursor is supplied", () => {
    test("when the cursor is invalid", async () => {
      const createResourceResolver = (_obj: PlainObject, args: PlainObject, { restClient }: PlainObject) => {
        return async ({ page }: { page: number }) => restClient({ ...removeConnectionInputOptions(args), page });
      };

      const connectionResolver = makeConnectionResolver({
        createMakeCursors,
        createResourceResolver,
        cursorCache: new Cachemap({
          name: "GRAPHQL_BOX_CONNECTION_RESOLVER",
          store: map(),
        }),
        getters,
        resultsPerPage,
      });

      const args = { before: "abcdefg", first: 5, query: "Hello world!" };
      const info = {};

      try {
        await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      } catch (e) {
        expect(e).toBeInstanceOf(GraphQLError);
        expect(e.message.startsWith("Invalid connection argument combination")).toBe(true);
      }
    });

    test("when there are NO missing pages in the cache", async () => {
      const createResourceResolver = (_obj: PlainObject, args: PlainObject, { restClient }: PlainObject) => {
        return async ({ page }: { page: number }) => restClient({ ...removeConnectionInputOptions(args), page });
      };

      const groupCursor = encode(JSON.stringify({ query: "Hello world!" }));

      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
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
        query: "Hello world!",
      };

      const info = {};
      expect(await connectionResolver({}, args, {}, info as GraphQLResolveInfo)).toMatchSnapshot();
    });

    test("when there are missing pages in the cache", async () => {
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });
      const mock = jest.fn().mockImplementation(page => pageResponse(page));

      const createResourceResolver = (
        _obj: PlainObject,
        _args: PlainObject,
        _context: PlainObject,
        _info: GraphQLResolveInfo,
      ) => async ({ page }: { page: number }) => mock(page);

      const groupCursor = encode(JSON.stringify({ query: "Hello world!" }));

      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1", "3-10"],
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
        query: "Hello world!",
      };

      const info = {};
      expect(await connectionResolver({}, args, {}, info as GraphQLResolveInfo)).toMatchSnapshot();
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(2);
    });
  });

  describe("when the first [X] number are requested", () => {
    test("when there is a fresh cache and there are NO missing pages in the cache", async () => {
      const createResourceResolver = (_obj: PlainObject, args: PlainObject, { restClient }: PlainObject) => {
        return async ({ page }: { page: number }) => restClient({ ...removeConnectionInputOptions(args), page });
      };

      const groupCursor = encode(JSON.stringify({ query: "Hello world!" }));

      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
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
        query: "Hello world!",
      };

      const info = {};
      expect(await connectionResolver({}, args, {}, info as GraphQLResolveInfo)).toMatchSnapshot();
    });

    test("when there is a fresh cache and there are missing pages in the cache", async () => {
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });
      const mock = jest.fn().mockImplementation(page => pageResponse(page));

      const createResourceResolver = (
        _obj: PlainObject,
        _args: PlainObject,
        _context: PlainObject,
        _info: GraphQLResolveInfo,
      ) => async ({ page }: { page: number }) => mock(page);

      const groupCursor = encode(JSON.stringify({ query: "Hello world!" }));

      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["2-10"],
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
        query: "Hello world!",
      };

      const info = {};
      expect(await connectionResolver({}, args, {}, info as GraphQLResolveInfo)).toMatchSnapshot();
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(1);
    });

    test("when there is NOT a fresh cache", async () => {
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });
      const mock = jest.fn().mockImplementation(page => pageResponse(page));

      const createResourceResolver = (
        _obj: PlainObject,
        _args: PlainObject,
        _context: PlainObject,
        _info: GraphQLResolveInfo,
      ) => async ({ page }: { page: number }) => mock(page);

      const cursorCache = new Cachemap({
        name: "cursorCache",
        store: map(),
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
        query: "Hello world!",
      };

      const info = {};
      expect(await connectionResolver({}, args, {}, info as GraphQLResolveInfo)).toMatchSnapshot();
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(1);
    });
  });

  describe("when the last [X] number are requested", () => {
    test("when there is a fresh cache and there are NO missing pages in the cache", async () => {
      const createResourceResolver = (_obj: PlainObject, args: PlainObject, { restClient }: PlainObject) => {
        return async ({ page }: { page: number }) => restClient({ ...removeConnectionInputOptions(args), page });
      };

      const groupCursor = encode(JSON.stringify({ query: "Hello world!" }));

      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-10"],
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
        query: "Hello world!",
      };

      const info = {};
      expect(await connectionResolver({}, args, {}, info as GraphQLResolveInfo)).toMatchSnapshot();
    });

    test("when there is a fresh cache and there are missing pages in the cache", async () => {
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });
      const mock = jest.fn().mockImplementation(page => pageResponse(page));

      const createResourceResolver = (
        _obj: PlainObject,
        _args: PlainObject,
        _context: PlainObject,
        _info: GraphQLResolveInfo,
      ) => async ({ page }: { page: number }) => mock(page);

      const groupCursor = encode(JSON.stringify({ query: "Hello world!" }));

      const cursorCache = await generateCursorCache({
        group: groupCursor,
        pageRanges: ["1-9"],
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
        query: "Hello world!",
      };

      const info = {};
      expect(await connectionResolver({}, args, {}, info as GraphQLResolveInfo)).toMatchSnapshot();
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(10);
    });

    test("when there is NOT a fresh cache", async () => {
      const pageResponse = generatePageResponse({ resultsPerPage, totalPages: 10, totalResults: 100 });
      const mock = jest.fn().mockImplementation(page => pageResponse(page));

      const createResourceResolver = (
        _obj: PlainObject,
        _args: PlainObject,
        _context: PlainObject,
        _info: GraphQLResolveInfo,
      ) => async ({ page }: { page: number }) => mock(page);

      const cursorCache = new Cachemap({
        name: "cursorCache",
        store: map(),
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
        query: "Hello world!",
      };

      const info = {};
      expect(await connectionResolver({}, args, {}, info as GraphQLResolveInfo)).toMatchSnapshot();
      expect(mock).toHaveBeenCalledTimes(2);
      expect(mock).toHaveBeenCalledWith(1);
      expect(mock).toHaveBeenCalledWith(10);
    });
  });
});
