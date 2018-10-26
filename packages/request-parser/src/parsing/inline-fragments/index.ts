import { FieldNode, InlineFragmentNode, SelectionNode } from "graphql";
import { FIELD, INLINE_FRAGMENT } from "../../consts";
import { getKind } from "../kind";

export function unwrapInlineFragments(selectionNodes: ReadonlyArray<SelectionNode>): FieldNode[] {
  let fieldNodes: FieldNode[] = [];

  for (const selectionNode of selectionNodes) {
    const kind = getKind(selectionNode);

    if (kind === FIELD) {
      const fieldNode = selectionNode as FieldNode;
      fieldNodes.push(fieldNode);
    } else if (kind === INLINE_FRAGMENT) {
      const inlineFragmentNode = selectionNode as InlineFragmentNode;
      fieldNodes = fieldNodes.concat(unwrapInlineFragments(inlineFragmentNode.selectionSet.selections));
    }
  }

  return fieldNodes;
}
