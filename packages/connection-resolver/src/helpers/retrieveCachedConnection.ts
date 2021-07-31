import Cachemap from "@cachemap/core";
import { flattenDeep } from "lodash";
import { ConnectionInputOptions, CursorCacheEntry, CursorGroupMetadata, Edge } from "../defs";
import getCursor from "./getCursor";
import { getEndIndex, getStartIndex } from "./getStartAndEndIndexes";
import retrieveCachedEdgesByPage from "./retrieveCachedEdgesByPage";

export type Context = {
  cursorCache: Cachemap;
  groupCursor: string;
  resultsPerPage: number;
};

export default async (args: ConnectionInputOptions, options: Context) => {
  const { cursorCache, groupCursor, resultsPerPage } = options;
  const indexesPerPage = resultsPerPage - 1;
  const resultsOnLastPage = totalResults % totalPages;
  const indexesOnLastPage = resultsOnLastPage === 0 ? indexesPerPage : resultsOnLastPage - 1;
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;
  const indexesOnThisPage = isLastPage ? indexesOnLastPage : indexesPerPage;
  const missingPages: number[] = [];
  let cachedEdges: Edge[] = [];
  let hasNextPage = false;
  let hasPreviousPage = false;

  const metadata = (await cursorCache.get(`${groupCursor}-metadata`)) as CursorGroupMetadata;
  const cursor = getCursor(args);
  const entry = (await cursorCache.get(cursor)) as CursorCacheEntry;
  const startIndex = getStartIndex(args, { entry, metadata, resultsPerPage });
  const endIndex = getEndIndex(args, { entry, metadata, resultsPerPage });

  if (direction === "forward") {
    const startIndex = index + 1;
    const endIndex = isLastPage && startIndex + count > indexesOnLastPage ? indexesOnLastPage : startIndex + count;
    const pageEndIndex = endIndex <= indexesOnThisPage ? endIndex : indexesOnThisPage;

    cachedEdges = (await retrieveCachedEdgesByPage(cursorCache, { group, page })).reduce((inRange, edge, i) => {
      if (i >= startIndex && i <= pageEndIndex) {
        inRange.push(edge);
      }

      return inRange;
    }, [] as Edge[]);

    if (!cachedEdges.length) {
      missingPages.push(page);
    }

    hasPreviousPage = page > 1 || startIndex > 0;

    if (endIndex <= indexesOnThisPage) {
      hasNextPage = page < totalPages || endIndex < indexesOnLastPage;
    }

    if (endIndex > indexesOnThisPage) {
      const outstanding = count - cachedEdges.length;
      const pagesToRequestFromCache = Math.ceil(outstanding / resultsPerPage);
      const resultsOnEndPage = outstanding % resultsPerPage;
      const endIndexOnEndPage = resultsOnEndPage === 0 ? indexesPerPage : resultsOnEndPage - 1;
      hasNextPage = page + pagesToRequestFromCache < totalPages || endIndexOnEndPage < indexesOnLastPage;
      const promises = [];

      for (let i = 1; i <= pagesToRequestFromCache; i += 1) {
        promises.push(retrieveCachedEdgesByPage(cursorCache, { group, page: page + i }));
      }

      const outstandingCachedEdges = await Promise.all(promises);

      const missingOutstandingPages = outstandingCachedEdges.reduce((missing, edges, i) => {
        if (!edges.length) {
          missing.push(page + i + 1);
        }

        return missing;
      }, [] as number[]);

      if (missingOutstandingPages.length) {
        missingPages.push(...missingOutstandingPages);
      }

      if (!missingPages.length) {
        const lastOutstandingCachedEdgesIndex = outstandingCachedEdges.length - 1;

        outstandingCachedEdges[lastOutstandingCachedEdgesIndex] = outstandingCachedEdges[
          lastOutstandingCachedEdgesIndex
        ].reduce((inRange, edge, i) => {
          if (i >= 0 && i <= endIndexOnEndPage) {
            inRange.push(edge);
          }

          return inRange;
        }, [] as Edge[]);

        cachedEdges = flattenDeep([...cachedEdges, ...outstandingCachedEdges]);
      }
    }
  } else {
    const endIndex = index - 1;
    const startIndex = isFirstPage && endIndex - count < 0 ? 0 : endIndex - count;
    const pageStartIndex = startIndex >= 0 ? startIndex : 0;

    cachedEdges = (await retrieveCachedEdgesByPage(cursorCache, { group, page })).reduce((inRange, edge, i) => {
      if (i >= pageStartIndex && i <= endIndex) {
        inRange.push(edge);
      }

      return inRange;
    }, [] as Edge[]);

    if (!cachedEdges.length) {
      missingPages.push(page);
    }

    hasNextPage = page < totalPages || endIndex < indexesOnLastPage;

    if (startIndex >= 0) {
      hasPreviousPage = page > 1 || startIndex > 0;
    }

    if (startIndex < 0) {
      const outstanding = count - cachedEdges.length;
      const pagesToRequestFromCache = Math.ceil(outstanding / resultsPerPage);
      hasPreviousPage = page - pagesToRequestFromCache > 1 || startIndex > 0;
      const promises = [];

      for (let i = 1; i <= pagesToRequestFromCache; i += 1) {
        promises.push(retrieveCachedEdgesByPage(cursorCache, { group, page: page - i }));
      }

      const outstandingCachedEdges = await Promise.all(promises);

      const missingOutstandingPages = outstandingCachedEdges.reduce((missing, edges, i) => {
        if (!edges.length) {
          missing.push(page - i - 1);
        }

        return missing;
      }, [] as number[]);

      if (missingOutstandingPages.length) {
        missingPages.push(...missingOutstandingPages);
      }

      if (!missingPages.length) {
        outstandingCachedEdges.reverse();
        const resultsOnStartPage = outstanding % resultsPerPage;
        const startIndexOnStartPage = resultsOnStartPage === 0 ? 0 : indexesPerPage - resultsOnStartPage;

        outstandingCachedEdges[0] = outstandingCachedEdges[0].reduce((inRange, edge, i) => {
          if (i >= startIndexOnStartPage && i <= indexesPerPage) {
            inRange.push(edge);
          }

          return inRange;
        }, [] as Edge[]);

        cachedEdges = flattenDeep([...outstandingCachedEdges, ...cachedEdges]);
      }
    }
  }

  return {
    cachedEdges,
    hasNextPage,
    hasPreviousPage,
    missingPages,
  };
};
