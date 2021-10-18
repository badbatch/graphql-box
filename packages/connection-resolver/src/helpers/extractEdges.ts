import { CachedEdges, Edge } from "../defs";

export default (cachedEdges: CachedEdges[]) =>
  cachedEdges.reduce((edges, cachedEdge) => [...edges, ...cachedEdge.edges], [] as Edge[]);
