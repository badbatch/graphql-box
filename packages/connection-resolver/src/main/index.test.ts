import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { encode } from "js-base64";
import makeConnectionResolver from ".";
import generateCursorCache from "../__testUtils__/generateCursorCache";
import { Getters } from "../defs";
import removeConnectionInputOptions from "../helpers/removeConnectionInputOptions";

describe("connectionResolver", () => {
  const createMakeCursors = (_source: Record<string, any>, args: Record<string, any>) => ({
    makeGroupCursor: () => encode(JSON.stringify(removeConnectionInputOptions(args))),
    makeIDCursor: (id: string | number) => encode(`${id}::${JSON.stringify(removeConnectionInputOptions(args))}`),
  });

  const createResourceResolver = (
    _obj: Record<string, any>,
    args: Record<string, any>,
    { restClient }: Record<string, any>,
  ) => {
    return async ({ page }: { page: number }) => restClient({ ...removeConnectionInputOptions(args), page });
  };

  const getters = {
    nodes: ({ results }) => results,
    page: ({ page }) => page,
    totalPages: ({ totalPages }) => totalPages,
    totalResults: ({ totalResults }) => totalResults,
  };

  const resultsPerPage = 10;

  describe("when a cursor is supplied", () => {
    test("when the cursor is invalid", async () => {
      const connectionResolver = makeConnectionResolver({
        createMakeCursors,
        createResourceResolver,
        cursorCache: new Cachemap({
          name: "GRAPHQL_BOX_CONNECTION_RESOLVER",
          store: map(),
        }),
        getters: (getters as unknown) as Getters,
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
        getters: (getters as unknown) as Getters,
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
  });
});
