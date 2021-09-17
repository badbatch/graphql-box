import { CachedEdges, Indexes } from "../defs";
import { getCurrentPageEndIndex, getCurrentPageStartIndex } from "./getCurrentPageStartAndEndIndexes";

export type Context = {
  endIndex: Indexes;
  resultsPerPage: number;
  startIndex: Indexes;
};

export default (cachedEdgesByPage: CachedEdges[], { endIndex, resultsPerPage, startIndex }: Context) => {
  return cachedEdgesByPage.reduce((inRange, cachedEdgesPage, i) => {
    const currentPageStartIndex = getCurrentPageStartIndex({ startIndex, pageIndex: i });

    const currentPageEndIndex = getCurrentPageEndIndex({
      endIndex,
      pageIndex: i,
      resultsPerPage,
      totalCachedPages: cachedEdgesByPage.length,
    });

    const cachedEdges = cachedEdgesPage.edges.slice(currentPageStartIndex, currentPageEndIndex + 1);
    inRange.push({ edges: cachedEdges, pageNumber: cachedEdgesPage.pageNumber });
    return inRange;
  }, [] as CachedEdges[]);
};
