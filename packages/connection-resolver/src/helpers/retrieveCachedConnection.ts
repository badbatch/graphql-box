import Cachemap from "@cachemap/core";
import { CachedEdges, ConnectionInputOptions, CursorCacheEntry, CursorGroupMetadata } from "../defs";
import getCursor from "./getCursor";
import getInRangeCachedEdges from "./getInRangeCachedEdges";
import getPageNumbersToRequest from "./getPageNumbersToRequest";
import getPagesMissingFromCache from "./getPagesMissingFromCache";
import { getEndIndex, getStartIndex } from "./getStartAndEndIndexes";
import { hasNextPage, hasPreviousPage } from "./hasPreviousNextPage";
import retrieveCachedEdgesByPage from "./retrieveCachedEdgesByPage";

export type Context = {
  cursorCache: Cachemap;
  groupCursor: string;
  resultsPerPage: number;
};

export default async (args: ConnectionInputOptions, { cursorCache, groupCursor, resultsPerPage }: Context) => {
  const metadata = (await cursorCache.get(`${groupCursor}-metadata`)) as CursorGroupMetadata;
  const cursor = getCursor(args);
  const entry = (await cursorCache.get(cursor)) as CursorCacheEntry;
  const startIndex = getStartIndex(args, { entry, resultsPerPage });
  const endIndex = getEndIndex(args, { entry, metadata, resultsPerPage });
  const promises: Promise<CachedEdges>[] = [];
  const pageNumbersToRequest = getPageNumbersToRequest(args, { endIndex, entry, metadata, resultsPerPage, startIndex });

  pageNumbersToRequest.forEach(pageNumber => {
    promises.push(retrieveCachedEdgesByPage(cursorCache, { groupCursor, pageNumber }));
  });

  const cachedEdgesByPage = await Promise.all(promises);

  return {
    cachedEdges: getInRangeCachedEdges(cachedEdgesByPage, { endIndex, resultsPerPage, startIndex }),
    hasNextPage: hasNextPage({
      cachedEdgesByPage,
      endIndex,
      metadata,
      resultsPerPage,
    }),
    hasPreviousPage: hasPreviousPage({ cachedEdgesByPage, startIndex }),
    missingPages: getPagesMissingFromCache(cachedEdgesByPage),
  };
};
