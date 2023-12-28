import { type Edge } from '../types.ts';

export const extractNodes = (edges: Edge[]) => edges.map(edge => edge.node);
