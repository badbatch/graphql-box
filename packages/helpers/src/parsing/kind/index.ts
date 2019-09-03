import { ASTNode } from "graphql";

export function getKind({ kind }: ASTNode): string {
  return kind;
}
