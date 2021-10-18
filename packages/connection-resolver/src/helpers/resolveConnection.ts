import Cachemap from "@cachemap/core";
import { ConnectionInputOptions, Getters, ResourceResolver } from "../defs";
import extractEdges from "./extractEdges";
import extractNodes from "./extractNodes";
import getInRangeCachedEdges from "./getInRangeCachedEdges";
import { getEndCursor, getStartCursor } from "./getStartAndEndCursors";
import mergeCachedEdges from "./mergeCachedEdges";
import requestAndCachePages from "./requestAndCachePages";
import retrieveCachedConnection from "./retrieveCachedConnection";

export type Context = {
  cursorCache: Cachemap;
  getters: Getters;
  groupCursor: string;
  makeIDCursor: (id: string | number) => string;
  resourceResolver: ResourceResolver;
  resultsPerPage: number;
};

export default async (
  args: Record<string, any> & ConnectionInputOptions,
  { cursorCache, getters, groupCursor, makeIDCursor, resourceResolver, resultsPerPage }: Context,
) => {
  const {
    cachedEdges,
    hasNextPage,
    hasPreviousPage,
    indexes,
    missingPages,
    totalResults,
  } = await retrieveCachedConnection(args, {
    cursorCache,
    groupCursor,
    resultsPerPage,
  });

  if (!missingPages.length) {
    const edges = extractEdges(cachedEdges);

    return {
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
    };
  }

  const { cachedEdges: missingCachedEdges, errors } = await requestAndCachePages(missingPages, {
    cursorCache,
    getters,
    groupCursor,
    makeIDCursor,
    resourceResolver,
  });

  const mergedCachedEdges = getInRangeCachedEdges(mergeCachedEdges(cachedEdges, missingCachedEdges), {
    endIndex: indexes.end,
    resultsPerPage,
    startIndex: indexes.start,
  });

  const edges = extractEdges(mergedCachedEdges);

  return {
    edges,
    errors,
    nodes: extractNodes(edges),
    pageInfo: {
      endCursor: getEndCursor(mergedCachedEdges),
      hasNextPage,
      hasPreviousPage,
      startCursor: getStartCursor(mergedCachedEdges),
    },
    totalCount: totalResults,
  };
};
