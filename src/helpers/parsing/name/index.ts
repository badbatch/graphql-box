import { ASTNode } from "graphql";
import { NamedASTNode } from "../types";

export function getName(node: ASTNode): string | undefined {
  if (!node.hasOwnProperty("name")) return undefined;
  const { name } = node as NamedASTNode;
  if (!name) return undefined;
  return name.value;
}
