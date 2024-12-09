import { type Core } from '@cachemap/core';
import { type CachedEdges, type ConnectionInputOptions, type CursorGroupMetadata } from '../types.ts';
import { getInRangeCachedEdges } from './getInRangeCachedEdges.ts';
import { getPageNumbersToRequest } from './getPageNumbersToRequest.ts';
import { getPagesMissingFromCache } from './getPagesMissingFromCache.ts';
import { getEndIndex, getStartIndex } from './getStartAndEndIndexes.ts';
import { hasNextPage, hasPreviousPage } from './hasPreviousNextPage.ts';
import { retrieveCachedEdgesByPage } from './retrieveCachedEdgesByPage.ts';
import { retrieveEntry } from './retrieveEntry.ts';

export type Context = {
  cursorCache: Core;
  groupCursor: string;
  resultsPerPage: number;
};

export const retrieveCachedConnection = async (
  args: ConnectionInputOptions,
  { cursorCache, groupCursor, resultsPerPage }: Context,
) => {
  /**
   * At this point the cache will always have metadata because `retrieveCachedConnection`
   * is called from `resolveConnection` and is only called if there is a cursor, either
   * after a direct check or after calling `validateCursor` or `requestAndCachePages`,
   * which check and set the metadata respectively.
   */
  const metadata = (await cursorCache.get<CursorGroupMetadata>(`${groupCursor}-metadata`))!;
  const entry = await retrieveEntry(args, metadata, { cursorCache, resultsPerPage });
  const startIndex = getStartIndex(args, { entry, resultsPerPage });
  const endIndex = getEndIndex(args, { entry, metadata, resultsPerPage });
  const promises: Promise<CachedEdges>[] = [];
  const pageNumbersToRequest = getPageNumbersToRequest(args, { endIndex, entry, metadata, resultsPerPage, startIndex });

  for (const pageNumber of pageNumbersToRequest) {
    promises.push(retrieveCachedEdgesByPage(cursorCache, { groupCursor, pageNumber }));
  }

  const cachedEdgesByPage = await Promise.all(promises);
  const missingPages = getPagesMissingFromCache(cachedEdgesByPage);

  return {
    cachedEdges:
      missingPages.length === 0
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
