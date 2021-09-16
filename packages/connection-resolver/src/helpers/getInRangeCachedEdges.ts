import { CachedEdges, Edge } from "../defs";
import { getCurrentPageEndIndex, getCurrentPageStartIndex } from "./getCurrentPageStartAndEndIndexes";

export type Context = {
  endIndex: number;
  resultsPerPage: number;
  startIndex: number;
};

export default (cachedEdgesByPage: CachedEdges[], { endIndex, resultsPerPage, startIndex }: Context) => {
  let decrementedEndIndex = endIndex;

  return cachedEdgesByPage.reduce((inRange, cachedEdgesPage, i) => {
    const currentPageStartIndex = getCurrentPageStartIndex({ startIndex, pageIndex: i });

    const currentPageEndIndex = getCurrentPageEndIndex({
      endIndex: decrementedEndIndex,
      pageIndex: i,
      resultsPerPage,
      totalCachedPages: cachedEdgesByPage.length,
    });

    const cachedEdges = cachedEdgesPage.edges.slice(currentPageStartIndex, currentPageEndIndex + 1);
    inRange.push(...cachedEdges);
    decrementedEndIndex = decrementedEndIndex - (currentPageEndIndex + 1);
    return inRange;
  }, [] as Edge[]);
};
