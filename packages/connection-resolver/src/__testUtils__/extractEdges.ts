import { CachedEdges } from "../defs";

export default (cachedEdges: CachedEdges[]) =>
  cachedEdges.reduce((edges, cachedEdge) => [...edges, ...cachedEdge.edges], []);
