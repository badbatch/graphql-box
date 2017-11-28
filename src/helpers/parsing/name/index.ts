import { ASTNode } from "graphql";
import { NamedASTNode } from "../types";

export function getName(node: ASTNode): string | void {
  if (!node.hasOwnProperty("name")) return;
  const { name } = node as NamedASTNode;
  return name.value;
}
