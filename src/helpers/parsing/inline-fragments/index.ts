import { FieldNode, InlineFragmentNode, SelectionNode } from "graphql";
import { getKind } from "../kind";

export function unwrapInlineFragments(selectionNodes: SelectionNode[]): FieldNode[] {
  let fieldNodes: FieldNode[] = [];

  for (const selectionNode of selectionNodes) {
    const kind = getKind(selectionNode);

    if (kind === "Field") {
      const fieldNode = selectionNode as FieldNode;
      fieldNodes.push(fieldNode);
    } else if (kind === "InlineFragment") {
      const inlineFragmentNode = selectionNode as InlineFragmentNode;
      fieldNodes = fieldNodes.concat(unwrapInlineFragments(inlineFragmentNode.selectionSet.selections));
    }
  }

  return fieldNodes;
}
