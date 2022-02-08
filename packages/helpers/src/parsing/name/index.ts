import { ASTNode } from "graphql";
import { NAME } from "../../consts";
import { NamedASTNode } from "../../defs";

export function getName(node: ASTNode) {
  if (!node.hasOwnProperty(NAME)) return undefined;

  const { name } = node as NamedASTNode;
  if (!name) return undefined;

  return name.value;
}
