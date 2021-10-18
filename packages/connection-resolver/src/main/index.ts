import { GraphQLResolveInfo } from "graphql";
import { Connection, ConnectionInputOptions, ConnectionResolverUserOptions } from "../defs";
import isCursorSupplied from "../helpers/isCursorSupplied";
import requestAndCachePages from "../helpers/requestAndCachePages";
import resolveConnection from "../helpers/resolveConnection";
import validateCursor from "../helpers/validateCursor";

export default ({
  cursorCache,
  createMakeCursors,
  createResourceResolver,
  getters,
  resolver,
  resultsPerPage,
}: ConnectionResolverUserOptions) => async (
  source: Record<string, any>,
  args: Record<string, any> & ConnectionInputOptions,
  context: Record<string, any>,
  info: GraphQLResolveInfo,
): Promise<Connection> => {
  try {
    const { makeGroupCursor, makeIDCursor } = createMakeCursors(source, args, context, info);
    const resourceResolver = createResourceResolver(source, args, context, info);
    const groupCursor = makeGroupCursor();

    if (isCursorSupplied(args)) {
      const cursorError = await validateCursor(args, info, {
        cursorCache,
        groupCursor,
        resultsPerPage,
      });

      if (cursorError) {
        return resolver({
          edges: [],
          errors: [cursorError],
          nodes: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
          totalCount: 0,
        });
      }

      return resolver(
        await resolveConnection(args, {
          cursorCache,
          getters,
          groupCursor,
          makeIDCursor,
          resourceResolver,
          resultsPerPage,
        }),
      );
    }

    if (await cursorCache.has(`${groupCursor}-metadata`)) {
      return resolver(
        await resolveConnection(args, {
          cursorCache,
          getters,
          groupCursor,
          makeIDCursor,
          resourceResolver,
          resultsPerPage,
        }),
      );
    }

    await requestAndCachePages([1], {
      cursorCache,
      getters,
      groupCursor,
      makeIDCursor,
      resourceResolver,
    });

    return resolver(
      await resolveConnection(args, {
        cursorCache,
        getters,
        groupCursor,
        makeIDCursor,
        resourceResolver,
        resultsPerPage,
      }),
    );
  } catch (e) {
    throw e;
  }
};
