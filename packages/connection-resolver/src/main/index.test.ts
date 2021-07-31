import Cachemap from "@cachemap/core";
import map from "@cachemap/map";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { encode } from "js-base64";
import makeConnectionResolver from ".";
import { ConnectionResolver, Getters } from "../defs";
import removeConnectionInputOptions from "../helpers/removeConnectionInputOptions";

describe("connectionResolver", () => {
  let connectionResolver: ConnectionResolver;
  let cursorCache: Cachemap;

  beforeEach(() => {
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

    cursorCache = new Cachemap({
      name: "GRAPHQL_BOX_CONNECTION_RESOLVER",
      store: map(),
    });

    const getters = {
      nodes: ({ results }) => results,
      page: ({ page }) => page,
      totalPages: ({ totalPages }) => totalPages,
      totalResults: ({ totalResults }) => totalResults,
    };

    connectionResolver = makeConnectionResolver({
      createMakeCursors,
      createResourceResolver,
      cursorCache,
      getters: (getters as unknown) as Getters,
      resultsPerPage: 20,
    });
  });

  describe("when a cursor is supplied", () => {
    test("when the cursor is invalid", async () => {
      const args = { before: "abcdefg", first: 5, query: "Hello world!" };
      const info = {};

      try {
        await connectionResolver({}, args, {}, info as GraphQLResolveInfo);
      } catch (e) {
        expect(e).toBeInstanceOf(GraphQLError);
        expect(e.message.startsWith("Invalid connection argument combination")).toBe(true);
      }
    });
  });
});
