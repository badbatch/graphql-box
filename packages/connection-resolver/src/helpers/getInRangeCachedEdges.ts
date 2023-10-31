import { type CachedEdges, type Indexes } from '../types.ts';
import { getCurrentPageEndIndex, getCurrentPageStartIndex } from './getCurrentPageStartAndEndIndexes.ts';

export type Context = {
  endIndex: Indexes;
  resultsPerPage: number;
  startIndex: Indexes;
};

export const getInRangeCachedEdges = (
  cachedEdgesByPage: CachedEdges[],
  { endIndex, resultsPerPage, startIndex }: Context
) => {
  return cachedEdgesByPage.reduce<CachedEdges[]>((inRange, cachedEdgesPage, index) => {
    const currentPageStartIndex = getCurrentPageStartIndex({ pageIndex: index, startIndex });

    const currentPageEndIndex = getCurrentPageEndIndex({
      endIndex,
      pageIndex: index,
      resultsPerPage,
      totalCachedPages: cachedEdgesByPage.length,
    });

    const cachedEdges = cachedEdgesPage.edges.slice(currentPageStartIndex, currentPageEndIndex + 1);
    inRange.push({ edges: cachedEdges, pageNumber: cachedEdgesPage.pageNumber });
    return inRange;
  }, []);
};
