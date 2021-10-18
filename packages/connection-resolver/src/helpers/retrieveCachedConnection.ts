import Cachemap from "@cachemap/core";
import { CachedEdges, ConnectionInputOptions, CursorGroupMetadata } from "../defs";
import getCursor from "./getCursor";
import getInRangeCachedEdges from "./getInRangeCachedEdges";
import getPageNumbersToRequest from "./getPageNumbersToRequest";
import getPagesMissingFromCache from "./getPagesMissingFromCache";
import { getEndIndex, getStartIndex } from "./getStartAndEndIndexes";
import { hasNextPage, hasPreviousPage } from "./hasPreviousNextPage";
import makeEntry from "./makeEntry";
import retrieveCachedEdgesByPage from "./retrieveCachedEdgesByPage";

export type Context = {
  cursorCache: Cachemap;
  groupCursor: string;
  resultsPerPage: number;
};

export default async (args: ConnectionInputOptions, { cursorCache, groupCursor, resultsPerPage }: Context) => {
  const metadata = (await cursorCache.get(`${groupCursor}-metadata`)) as CursorGroupMetadata;
  const cursor = getCursor(args);
  const entry = cursor ? await cursorCache.get(cursor) : makeEntry(args, { metadata, resultsPerPage });
  const startIndex = getStartIndex(args, { entry, resultsPerPage });
  const endIndex = getEndIndex(args, { entry, metadata, resultsPerPage });
  const promises: Promise<CachedEdges>[] = [];
  const pageNumbersToRequest = getPageNumbersToRequest(args, { endIndex, entry, metadata, resultsPerPage, startIndex });

  pageNumbersToRequest.forEach(pageNumber => {
    promises.push(retrieveCachedEdgesByPage(cursorCache, { groupCursor, pageNumber }));
  });

  const cachedEdgesByPage = await Promise.all(promises);
  const missingPages = getPagesMissingFromCache(cachedEdgesByPage);

  return {
    cachedEdges: !missingPages.length
      ? getInRangeCachedEdges(cachedEdgesByPage, { endIndex, resultsPerPage, startIndex })
      : cachedEdgesByPage,
    hasNextPage: hasNextPage({
      cachedEdgesByPage,
      endIndex,
      metadata,
      resultsPerPage,
    }),
    hasPreviousPage: hasPreviousPage({ cachedEdgesByPage, startIndex }),
    indexes: { end: endIndex, start: startIndex },
    missingPages,
    totalResults: metadata.totalResults,
  };
};
