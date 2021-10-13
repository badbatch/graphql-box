import { CachedEdges, Edge } from "../defs";

export default (cachedEdges: CachedEdges[], missingCachedEdges: CachedEdges[] = []) =>
  cachedEdges.reduce((edges, cachedEdge) => {
    if (!cachedEdge.edges.length && missingCachedEdges.length) {
      const missingCachedEdge = missingCachedEdges.find(missing => missing.pageNumber === cachedEdge.pageNumber);

      if (missingCachedEdge) {
        return [...edges, ...missingCachedEdge.edges];
      }
    }

    return [...edges, ...cachedEdge.edges];
  }, [] as Edge[]);
