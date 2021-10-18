import { CachedEdges } from "../defs";

export default (cachedEdges: CachedEdges[], missingCachedEdges: CachedEdges[]) =>
  cachedEdges.reduce((mergedCachedEdges, cachedEdge) => {
    if (!cachedEdge.edges.length) {
      const missingCachedEdge = missingCachedEdges.find(missing => missing.pageNumber === cachedEdge.pageNumber);

      if (missingCachedEdge) {
        return [...mergedCachedEdges, missingCachedEdge];
      }
    }

    return [...mergedCachedEdges, cachedEdge];
  }, [] as CachedEdges[]);
