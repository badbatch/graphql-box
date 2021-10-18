import { CachedEdges } from "../defs";

export const getStartCursor = (cachedEdges: CachedEdges[]) => cachedEdges[0].edges[0].cursor;

export const getEndCursor = (cachedEdges: CachedEdges[]) => {
  const lastCachedEdges = cachedEdges[cachedEdges.length - 1];
  const lastCachedEdge = lastCachedEdges.edges[lastCachedEdges.edges.length - 1];
  return lastCachedEdge.cursor;
};
