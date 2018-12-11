import { ASTNode } from "graphql";
import { NAME } from "../../consts";
import * as defs from "../../defs";

export function getName(node: ASTNode): string | undefined {
  if (!node.hasOwnProperty(NAME)) return undefined;

  const { name } = node as defs.NamedASTNode;
  if (!name) return undefined;

  return name.value;
}
