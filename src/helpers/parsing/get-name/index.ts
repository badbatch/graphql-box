import { ASTNode } from "graphql";
import { NamedASTNode } from "../types";

export default function getName(node: ASTNode): string | null {
  if (!node.hasOwnProperty("name")) return null;
  const { name } = node as NamedASTNode;
  return name.value;
}
