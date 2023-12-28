import { type CachedEdges } from '../types.ts';

export const mergeCachedEdges = (cachedEdges: CachedEdges[], missingCachedEdges: CachedEdges[]) =>
  cachedEdges.reduce<CachedEdges[]>((mergedCachedEdges, cachedEdge) => {
    if (cachedEdge.edges.length === 0) {
      const missingCachedEdge = missingCachedEdges.find(missing => missing.pageNumber === cachedEdge.pageNumber);

      if (missingCachedEdge) {
        return [...mergedCachedEdges, missingCachedEdge];
      }
    }

    return [...mergedCachedEdges, cachedEdge];
  }, []);
