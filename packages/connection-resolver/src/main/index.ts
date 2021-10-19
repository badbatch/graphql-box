import { GraphQLResolveInfo } from "graphql";
import { Connection, ConnectionInputOptions, ConnectionResolverUserOptions, Node, PlainObject } from "../defs";
import isCursorSupplied from "../helpers/isCursorSupplied";
import requestAndCachePages from "../helpers/requestAndCachePages";
import resolveConnection from "../helpers/resolveConnection";
import validateCursor from "../helpers/validateCursor";

const main = <
  Source extends PlainObject,
  Args extends PlainObject,
  Ctx extends PlainObject,
  Resource extends PlainObject,
  ResourceNode extends Node
>({
  cursorCache,
  createMakeCursors,
  createResourceResolver,
  getters,
  resolver = result => result,
  resultsPerPage,
}: ConnectionResolverUserOptions<Source, Args, Ctx, Resource, ResourceNode>) => async (
  source: Source,
  args: Args & ConnectionInputOptions,
  context: Ctx,
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

    await requestAndCachePages<Resource, ResourceNode>([1], {
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

export default main;
