import { FieldNode, InlineFragmentNode, SelectionNode } from "graphql";
import { FIELD, INLINE_FRAGMENT } from "../../consts";
import { UnwrapInlineFragmentsResult } from "../../defs";
import { getKind } from "../kind";
import { getName } from "../name";

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

export function unwrapInlineFragments(
  selectionNodes: ReadonlyArray<SelectionNode>,
  maxDepth: number = 1,
  depth: number = 0,
): UnwrapInlineFragmentsResult {
  let fieldNodes: FieldNode[] = [];
  let inlineFragmentType: string | undefined;

  for (const selectionNode of selectionNodes) {
    const kind = getKind(selectionNode);

    if (kind === FIELD) {
      const fieldNode = selectionNode as FieldNode;
      fieldNodes.push(fieldNode);
    } else if (kind === INLINE_FRAGMENT && depth < maxDepth) {
      const inlineFragmentNode = selectionNode as InlineFragmentNode;

      inlineFragmentType = inlineFragmentNode.typeCondition
        ? getName(inlineFragmentNode.typeCondition) as string : undefined;

      const { fieldNodes: unwrappedFieldNodes } = unwrapInlineFragments(
        inlineFragmentNode.selectionSet.selections,
        maxDepth,
        depth + 1,
      );

      fieldNodes = fieldNodes.concat(unwrappedFieldNodes);
    }
  }

  return { fieldNodes, inlineFragmentType };
}
