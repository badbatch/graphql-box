import { FieldNode, InlineFragmentNode, SelectionNode } from "graphql";
import { FIELD, INLINE_FRAGMENT } from "../../consts";
import { getKind } from "../kind";

export function hasInlineFragments({ selectionSet }: FieldNode): boolean {
  if (!selectionSet) return false;
  return selectionSet.selections.some((value) => getKind(value) === INLINE_FRAGMENT);
}

export function setInlineFragments({ selectionSet }: FieldNode): void {
  if (!selectionSet) return;
  const selectionNodes = [...selectionSet.selections];
  let inlineFragmentSelectionNodes: ReadonlyArray<SelectionNode> = [];

  for (let i = selectionNodes.length - 1; i >= 0; i -= 1) {
    const selectionNode = selectionNodes[i];
    const kind = getKind(selectionNode);

    if (kind === INLINE_FRAGMENT) {
      const inlineFragmentNode = selectionNode as InlineFragmentNode;
      inlineFragmentSelectionNodes = inlineFragmentNode.selectionSet.selections;
      selectionNodes.splice(i, 1, ...inlineFragmentSelectionNodes);
    }
  }

  selectionSet.selections = selectionNodes;
}

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
