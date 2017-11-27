import { ASTNode } from "graphql";

export default function getKind({ kind }: ASTNode): string {
  return kind;
}
