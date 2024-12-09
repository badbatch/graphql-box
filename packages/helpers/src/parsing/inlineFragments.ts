import {
  type FieldNode,
  type FragmentDefinitionNode,
  type InlineFragmentNode,
  Kind,
  type OperationDefinitionNode,
  type SelectionNode,
} from 'graphql';
import { castArray } from 'lodash-es';
import { type FieldAndTypeName, type ParentNode } from '../types.ts';
import { getKind, isKind } from './kind.ts';
import { getName } from './name.ts';
import { getTypeCondition } from './typeCondition.ts';

export const deleteInlineFragments = (node: ParentNode, inlineFragments: InlineFragmentNode[] | InlineFragmentNode) => {
  if (!node.selectionSet) return;

  const castInlineFragments = castArray(inlineFragments);
  const childFields = [...node.selectionSet.selections];

  for (let index = childFields.length - 1; index >= 0; index -= 1) {
    const childField = childFields[index];

    if (childField && getKind(childField) === Kind.INLINE_FRAGMENT) {
      const inlineFragmentNode = childField as InlineFragmentNode;

      if (castInlineFragments.includes(inlineFragmentNode)) {
        childFields.splice(index, 1);
      }
    }
  }

  node.selectionSet.selections = childFields;
};

export const getInlineFragments = ({
  selectionSet,
}: FieldNode | InlineFragmentNode | FragmentDefinitionNode | OperationDefinitionNode) => {
  const inlineFragments: InlineFragmentNode[] = [];

  if (!selectionSet) {
    return inlineFragments;
  }

  const selectionNodes = [...selectionSet.selections];

  for (let index = selectionNodes.length - 1; index >= 0; index -= 1) {
    const selectionNode = selectionNodes[index];

    if (selectionNode) {
      const kind = getKind(selectionNode);

      if (kind === Kind.INLINE_FRAGMENT) {
        inlineFragments.push(selectionNode as InlineFragmentNode);
      }
    }
  }

  return inlineFragments;
};

export const hasInlineFragments = ({ selectionSet }: FieldNode | InlineFragmentNode | FragmentDefinitionNode) => {
  if (!selectionSet) {
    return false;
  }

  return selectionSet.selections.some(value => getKind(value) === Kind.INLINE_FRAGMENT);
};

export const resolveInlineFragments = (
  selectionNodes: readonly SelectionNode[],
  maxDepth = 1,
  depth = 0,
  typeName?: string,
  fragmentKind?: string,
): FieldAndTypeName[] => {
  let fieldAndTypeName: FieldAndTypeName[] = [];

  for (const selectionNode of selectionNodes) {
    if (isKind<FieldNode>(selectionNode, Kind.FIELD)) {
      fieldAndTypeName.push({ fieldNode: selectionNode, fragmentKind, fragmentName: undefined, typeName });
    } else if (isKind<InlineFragmentNode>(selectionNode, Kind.INLINE_FRAGMENT) && depth < maxDepth) {
      const inlineFragmentTypeName = selectionNode.typeCondition ? getName(selectionNode.typeCondition)! : undefined;

      const resolvedFieldAndTypeName = resolveInlineFragments(
        selectionNode.selectionSet.selections,
        maxDepth,
        depth + 1,
        inlineFragmentTypeName,
        Kind.INLINE_FRAGMENT,
      );

      fieldAndTypeName = [...fieldAndTypeName, ...resolvedFieldAndTypeName];
    }
  }

  return fieldAndTypeName;
};

export const setInlineFragments = (
  { selectionSet }: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) => {
  let fragmentsSet = 0;

  if (!selectionSet) {
    return fragmentsSet;
  }

  const selectionNodes = [...selectionSet.selections];
  let inlineFragmentSelectionNodes: readonly SelectionNode[] = [];

  for (let index = selectionNodes.length - 1; index >= 0; index -= 1) {
    const selectionNode = selectionNodes[index];

    if (!selectionNode) {
      continue;
    }

    const isInlineFragment = isKind<InlineFragmentNode>(selectionNode, Kind.INLINE_FRAGMENT);

    if (!isInlineFragment) {
      continue;
    }

    const isIncluded = include.length > 0 && include.includes(getName(getTypeCondition(selectionNode)!)!);

    const isExcluded =
      (include.length > 0 && !isIncluded) || exclude.includes(getName(getTypeCondition(selectionNode)!)!);

    if (isIncluded || !isExcluded) {
      inlineFragmentSelectionNodes = selectionNode.selectionSet.selections;
      selectionNodes.splice(index, 1, ...inlineFragmentSelectionNodes);
      fragmentsSet += 1;
    }
  }

  selectionSet.selections = selectionNodes;
  return fragmentsSet;
};
