import { GraphQLResolveInfo } from "graphql";
import { Connection, ConnectionAdapterUserOptions, ConnectionInputOptions } from "../defs";
import extractEdges from "../helpers/extractEdges";
import extractNodes from "../helpers/extractNodes";
import { getEndCursor, getStartCursor } from "../helpers/getStartAndEndCursors";
import isCursorSupplied from "../helpers/isCursorSupplied";
import requestAndCachePages from "../helpers/requestAndCachePages";
import retrieveCachedConnection from "../helpers/retrieveCachedConnection";
import validateCursor from "../helpers/validateCursor";

// type PageInfo {
//   hasNextPage: Boolean!
//   hasPreviousPage: Boolean!
//   startCursor: String
//   endCursor: String
// }

// type SearchEdge {
//   cursor: String!
//   node: SearchEntity
// }

// type SearchConnection implements Connection {
//   edges: [SearchEdge]
//   pageInfo: PageInfo!
//   totalResults: Int!
// }

// nodes: (obj: PlainObjectMap) => PlainObjectMap[];
// page: (obj: PlainObjectMap) => number;
// totalPages: (obj: PlainObjectMap) => number;
// totalResults: (obj: PlainObjectMap) => number;

export default ({
  cursorCache,
  createMakeCursors,
  createResourceResolver,
  getters,
  resolver,
  resultsPerPage,
}: ConnectionAdapterUserOptions) => {
  return async (
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

        const {
          cachedEdges,
          hasNextPage,
          hasPreviousPage,
          missingPages,
          totalResults,
        } = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });

        if (!missingPages.length) {
          const edges = extractEdges(cachedEdges);

          return resolver({
            edges,
            errors: [],
            nodes: extractNodes(edges),
            pageInfo: {
              endCursor: getEndCursor(cachedEdges),
              hasNextPage,
              hasPreviousPage,
              startCursor: getStartCursor(cachedEdges),
            },
            totalCount: totalResults,
          });
        }

        const { cachedEdges: missingCachedPages, errors } = await requestAndCachePages(missingPages, {
          cursorCache,
          getters,
          groupCursor,
          makeIDCursor,
          resourceResolver,
        });

        const edges = extractEdges(cachedEdges, missingCachedPages);

        return resolver({
          edges,
          errors,
          nodes: extractNodes(edges),
          pageInfo: {
            endCursor: getEndCursor(cachedEdges),
            hasNextPage,
            hasPreviousPage,
            startCursor: getStartCursor(cachedEdges),
          },
          totalCount: totalResults,
        });

        // TODO
      }
    } catch (e) {
      throw e;
    }
  };
};
