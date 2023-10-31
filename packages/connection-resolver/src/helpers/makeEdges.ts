import { type Node } from '../types.ts';

export const makeEdges = (nodes: Node[], makeCursor: (node: Node) => string) =>
  nodes.map(node => ({ cursor: makeCursor(node), node }));
