import { Node } from "../defs";

export default (nodes: Node[], makeCursor: (node: Node) => string) =>
  nodes.map(node => ({ node, cursor: makeCursor(node) }));
