import { ASTNode } from "graphql";

export function getKind({ kind }: ASTNode): string {
  return kind;
}

export function isKind<T extends ASTNode>(node: ASTNode, name: string): node is T {
  return node.kind === name;
}
