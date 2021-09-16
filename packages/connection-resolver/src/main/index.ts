import { GraphQLError, GraphQLResolveInfo } from "graphql";
import {
  Connection,
  ConnectionAdapterUserOptions,
  ConnectionInputOptions,
  CursorCacheEntry,
  CursorGroupMetadata,
} from "../defs";
import isCursorSupplied from "../helpers/isCursorSupplied";
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
        const cursorError = validateCursor(args, info, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });

        if (cursorError) {
          throw cursorError;
        }

        const { cachedEdges, hasNextPage, hasPreviousPage, missingPages } = await retrieveCachedConnection(args, {
          cursorCache,
          groupCursor,
          resultsPerPage,
        });

        //   if (cachedEdges?.length && !missingPages?.length) {
        //     const startCursor = getStartCursor(cachedEdges);
        //     const endCursor = getEndCursor(cachedEdges);

        //     return {
        //       edges: cachedEdges,
        //       pageInfo: {
        //         endCursor,
        //         hasNextPage: hasNextPage as boolean,
        //         hasPreviousPage: hasPreviousPage as boolean,
        //         startCursor,
        //       },
        //       totalResults,
        //     };
        //   }

        //   if (missingPages?.length) {
        //     const promises = missingPages.map(async page => {
        //       const { data: pageResultData, headers: pageResultHeaders } = await resourceResolver({ page });

        //       if (pageResultData) {
        //         cacheCursors(cursorCache, {
        //           edges: makeEdges(getters.nodes(pageResultData), node => makeIDCursor(node.id)),
        //           group: groupCursor,
        //           headers: pageResultHeaders,
        //           page,
        //           totalPages: getters.totalPages(pageResultData),
        //           totalResults: getters.totalResults(pageResultData),
        //         });
        //       }
        //     });

        //     await Promise.all(promises);

        //     const {
        //       cachedEdges: latestCachedEdges,
        //       hasNextPage: latestHasNextPage,
        //       hasPreviousPage: latestHasPreviousPage,
        //     } = await retrieveCachedConnection(cursorCache, {
        //       count,
        //       cursor,
        //       direction,
        //       resultsPerPage,
        //       totalPages,
        //       totalResults,
        //     });

        //     if (latestCachedEdges?.length) {
        //       const startCursor = getStartCursor(latestCachedEdges);
        //       const endCursor = getEndCursor(latestCachedEdges);

        //       return {
        //         edges: latestCachedEdges,
        //         pageInfo: {
        //           endCursor,
        //           hasNextPage: latestHasNextPage as boolean,
        //           hasPreviousPage: latestHasPreviousPage as boolean,
        //           startCursor,
        //         },
        //         totalResults,
        //       };
        //     }
        //   }
        // } else {
        //   const page = 1;
        //   // NOTE: Need to do something about negative scenarios
        //   const { data, headers, errors } = await resourceResolver({ page });

        //   if (!data || errors?.length) {
        //     const reason = !data ? "No data returned" : `Errors returned`;

        //     throw new GraphQLError(
        //       `Failed to resolve connection. ${reason}.`,
        //       fieldNodes,
        //       undefined,
        //       undefined,
        //       undefined,
        //       errors?.[0],
        //     );
        //   }

        //   const nodes = getters.nodes(data);
        //   const totalPages = getters.totalPages(data);
        //   const totalResults = getters.totalResults(data);
        //   const edges = makeEdges(nodes, node => makeIDCursor(node.id));
        //   cacheCursors(cursorCache, { headers, edges, group: groupCursor, page, totalPages, totalResults });

        //   if (first) {
        //     if (first < nodes.length || nodes.length === totalResults) {
        //       const indexesToRequest = (first < nodes.length ? first : nodes.length) - 1;
        //       const requestedEdges = edges.slice(0, indexesToRequest);
        //       const startCursor = getStartCursor(requestedEdges);
        //       const endCursor = getEndCursor(requestedEdges);

        //       return {
        //         edges: requestedEdges,
        //         pageInfo: {
        //           endCursor,
        //           startCursor,
        //           ...calcHasPreviousNextPage({
        //             edges,
        //             endCursor,
        //             page,
        //             resultsPerPage,
        //             startCursor,
        //             totalPages,
        //             totalResults,
        //           }),
        //         },
        //         totalResults,
        //       };
        //     }

        //     const { pageResults } = await requestOutstandingPages(
        //       { count, direction, page: page + 1, results: nodes.length, resultsPerPage, totalPages, totalResults },
        //       // NOTE: Need to do something about negative scenarios
        //       ({ nextPage }) => resourceResolver({ page: nextPage }),
        //     );

        //     // NOTE: Need to do something with missingPages, not sure how to handle that

        //     pageResults.forEach(({ data: pageResultData, headers: pageResultHeaders }) => {
        //       cacheCursors(cursorCache, {
        //         edges: makeEdges(getters.nodes(pageResultData), node => makeIDCursor(node.id)),
        //         group: groupCursor,
        //         headers: pageResultHeaders,
        //         page,
        //         totalPages: getters.totalPages(pageResultData),
        //         totalResults: getters.totalResults(pageResultData),
        //       });
        //     });

        //     const {
        //       cachedEdges: latestCachedEdges,
        //       hasNextPage: latestHasNextPage,
        //       hasPreviousPage: latestHasPreviousPage,
        //     } = await retrieveCachedConnection(cursorCache, {
        //       count,
        //       cursor: getStartCursor(edges),
        //       direction,
        //       resultsPerPage,
        //       totalPages,
        //       totalResults,
        //     });

        //     if (latestCachedEdges?.length) {
        //       return {
        //         edges: latestCachedEdges,
        //         pageInfo: {
        //           endCursor: getEndCursor(latestCachedEdges),
        //           hasNextPage: latestHasNextPage as boolean,
        //           hasPreviousPage: latestHasPreviousPage as boolean,
        //           startCursor: getStartCursor(latestCachedEdges),
        //         },
        //         totalResults,
        //       };
        //     }
        //   } else {
        //     const { pageResults } = await requestOutstandingPages(
        //       { count, direction, page: totalPages, results: 0, resultsPerPage, totalPages, totalResults },
        //       // NOTE: Need to do something about negative scenarios
        //       ({ nextPage }) => resourceResolver({ page: nextPage }),
        //     );

        //     pageResults.forEach(({ data: pageResultData, headers: pageResultHeaders }) => {
        //       cacheCursors(cursorCache, {
        //         edges: makeEdges(getters.nodes(pageResultData), node => makeIDCursor(node.id)),
        //         group: groupCursor,
        //         headers: pageResultHeaders,
        //         page,
        //         totalPages: getters.totalPages(pageResultData),
        //         totalResults: getters.totalResults(pageResultData),
        //       });
        //     });

        //     const {
        //       cachedEdges: latestCachedEdges,
        //       hasNextPage: latestHasNextPage,
        //       hasPreviousPage: latestHasPreviousPage,
        //     } = await retrieveCachedConnection(cursorCache, {
        //       count,
        //       cursor: getStartCursor(edges),
        //       direction,
        //       resultsPerPage,
        //       totalPages,
        //       totalResults,
        //     });

        //     if (latestCachedEdges?.length) {
        //       return {
        //         edges: latestCachedEdges,
        //         pageInfo: {
        //           endCursor: getEndCursor(latestCachedEdges),
        //           hasNextPage: latestHasNextPage as boolean,
        //           hasPreviousPage: latestHasPreviousPage as boolean,
        //           startCursor: getStartCursor(latestCachedEdges),
        //         },
        //         totalResults,
        //       };
        //     }
        //   }
      }
    } catch (e) {
      throw e;
    }
  };
};
