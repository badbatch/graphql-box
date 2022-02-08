import { FieldNode, FragmentDefinitionNode, InlineFragmentNode, NamedTypeNode, SelectionNode } from "graphql";
import { castArray } from "lodash";
import { FIELD, INLINE_FRAGMENT } from "../../consts";
import { FieldAndTypeName, ParentNode } from "../../defs";
import { getKind, isKind } from "../kind";
import { getName } from "../name";
import { getTypeCondition } from "../type-condition";

export function deleteInlineFragments(node: ParentNode, inlineFragments: InlineFragmentNode[] | InlineFragmentNode) {
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

export function getInlineFragments({ selectionSet }: FieldNode | InlineFragmentNode | FragmentDefinitionNode) {
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

export function hasInlineFragments({ selectionSet }: FieldNode | InlineFragmentNode | FragmentDefinitionNode) {
  if (!selectionSet) return false;
  return selectionSet.selections.some(value => getKind(value) === INLINE_FRAGMENT);
}

export const setInlineFragments = (
  { selectionSet }: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) => {
  let fragmentsSet = 0;

  if (!selectionSet) {
    return fragmentsSet;
  }

  const selectionNodes = [...selectionSet.selections];
  let inlineFragmentSelectionNodes: ReadonlyArray<SelectionNode> = [];

  for (let i = selectionNodes.length - 1; i >= 0; i -= 1) {
    const selectionNode = selectionNodes[i];
    const isInlineFragment = isKind<InlineFragmentNode>(selectionNode, INLINE_FRAGMENT);

    if (!isInlineFragment) {
      continue;
    }

    const isIncluded =
      !!include.length &&
      include.includes(getName(getTypeCondition(selectionNode) as NamedTypeNode) as NamedTypeNode["name"]["value"]);

    const isExcluded =
      (include.length && !isIncluded) ||
      exclude.includes(getName(getTypeCondition(selectionNode) as NamedTypeNode) as NamedTypeNode["name"]["value"]);

    if (isIncluded || !isExcluded) {
      inlineFragmentSelectionNodes = selectionNode.selectionSet.selections;
      selectionNodes.splice(i, 1, ...inlineFragmentSelectionNodes);
      fragmentsSet += 1;
    }
  }

  selectionSet.selections = selectionNodes;
  return fragmentsSet;
};

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
