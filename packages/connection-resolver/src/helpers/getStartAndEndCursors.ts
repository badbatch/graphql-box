import { type Edge } from '../types.ts';

export const getStartCursor = (edges: Edge[]) => edges[0]?.cursor;

export const getEndCursor = (edges: Edge[]) => {
  const lastEdge = edges.at(-1);
  return lastEdge?.cursor;
};
