import { InlineFragmentNode, NamedTypeNode } from "graphql";

export function getTypeCondition({ typeCondition }: InlineFragmentNode): NamedTypeNode | void {
  return typeCondition;
}
