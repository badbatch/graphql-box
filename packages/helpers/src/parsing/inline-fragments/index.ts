import { FieldNode, InlineFragmentNode, SelectionNode } from "graphql";
import { castArray } from "lodash";
import { FIELD, INLINE_FRAGMENT } from "../../consts";
import { FieldAndTypeName, ParentNode } from "../../defs";
import { getKind } from "../kind";
import { getName } from "../name";

export function deleteInlineFragments(
  node: ParentNode,
  inlineFragments: InlineFragmentNode[] | InlineFragmentNode,
): void {
  if (!node.selectionSet) return;

  const castInlineFragments = castArray(inlineFragments);
  const childFields = [...node.selectionSet.selections];

  for (let i = childFields.length - 1; i >= 0; i -= 1) {
    if (getKind(childFields[i]) === INLINE_FRAGMENT) {
      const inlineFragmentNode = childFields[i] as InlineFragmentNode;

      if (castInlineFragments.some(inlineFragment => inlineFragment === inlineFragmentNode)) {
        childFields.splice(i, 1);
      }
    }
  }

  node.selectionSet.selections = childFields;
}

export function getInlineFragments({ selectionSet }: FieldNode): InlineFragmentNode[] {
  const inlineFragments: InlineFragmentNode[] = [];
  if (!selectionSet) return inlineFragments;

  const selectionNodes = [...selectionSet.selections];

  for (let i = selectionNodes.length - 1; i >= 0; i -= 1) {
    const selectionNode = selectionNodes[i];
    const kind = getKind(selectionNode);

    if (kind === INLINE_FRAGMENT) {
      inlineFragments.push(selectionNode as InlineFragmentNode);
    }
  }

  return inlineFragments;
}

export function hasInlineFragments({ selectionSet }: FieldNode): boolean {
  if (!selectionSet) return false;
  return selectionSet.selections.some(value => getKind(value) === INLINE_FRAGMENT);
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
  typeName?: string,
): FieldAndTypeName[] {
  let fieldAndTypeName: FieldAndTypeName[] = [];
  let inlineFragmentType: string | undefined;

  for (const selectionNode of selectionNodes) {
    const kind = getKind(selectionNode);

    if (kind === FIELD) {
      const fieldNode = selectionNode as FieldNode;
      fieldAndTypeName.push({ fieldNode, typeName });
    } else if (kind === INLINE_FRAGMENT && depth < maxDepth) {
      const inlineFragmentNode = selectionNode as InlineFragmentNode;

      inlineFragmentType = inlineFragmentNode.typeCondition
        ? (getName(inlineFragmentNode.typeCondition) as string)
        : undefined;

      const unwrappedFieldAndTypeName = unwrapInlineFragments(
        inlineFragmentNode.selectionSet.selections,
        maxDepth,
        depth + 1,
        inlineFragmentType,
      );

      fieldAndTypeName = fieldAndTypeName.concat(unwrappedFieldAndTypeName);
    }
  }

  return fieldAndTypeName;
}
