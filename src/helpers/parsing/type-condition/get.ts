import { InlineFragmentNode, NamedTypeNode } from "graphql";

export default function getTypeCondition({ typeCondition }: InlineFragmentNode): NamedTypeNode | void {
  return typeCondition;
}
