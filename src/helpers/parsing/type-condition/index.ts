import { InlineFragmentNode, NamedTypeNode } from "graphql";

export function getTypeCondition({ typeCondition }: InlineFragmentNode): NamedTypeNode | undefined {
  return typeCondition;
}
