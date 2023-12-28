import { type CachedEdges, type Edge } from '../types.ts';

export const extractEdges = (cachedEdges: CachedEdges[]) =>
  cachedEdges.reduce<Edge[]>((edges, cachedEdge) => [...edges, ...cachedEdge.edges], []);
