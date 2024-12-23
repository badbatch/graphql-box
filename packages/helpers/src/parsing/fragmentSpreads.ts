import { type FragmentDefinitionNodeMap } from '@graphql-box/core';
import {
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type InlineFragmentNode,
  Kind,
  type SelectionNode,
} from 'graphql';
import { castArray } from 'lodash-es';
import { type FieldAndTypeName, type ParentNode } from '../types.ts';
import { isKind } from './kind.ts';

export const deleteFragmentSpreads = (node: ParentNode, spreadNames: string[] | string): void => {
  if (!node.selectionSet) {
    return;
  }

  const castSpreadNames = castArray(spreadNames);
  const childFields = [...node.selectionSet.selections];

  for (let index = childFields.length - 1; index >= 0; index -= 1) {
    const childField = childFields[index];

    if (!childField) {
      continue;
    }

    if (isKind<FragmentSpreadNode>(childField, Kind.FRAGMENT_SPREAD)) {
      if (castSpreadNames.includes(childField.name.value)) {
        childFields.splice(index, 1);
      }
    } else if (isKind<InlineFragmentNode>(childField, Kind.INLINE_FRAGMENT)) {
      deleteFragmentSpreads(childField, castSpreadNames);
    }
  }

  node.selectionSet.selections = childFields;
};

export const hasFragmentSpreads = ({
  selectionSet,
}: FieldNode | InlineFragmentNode | FragmentDefinitionNode): boolean => {
  if (!selectionSet) return false;

  const { selections } = selectionSet;
  return selections.some(value => isKind<FragmentSpreadNode>(value, Kind.FRAGMENT_SPREAD));
};

export const getFragmentSpreads = (
  fieldNode: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) => {
  if (!hasFragmentSpreads(fieldNode)) {
    return [];
  }

  return (
    fieldNode.selectionSet?.selections.filter(value => {
      const isFragmentSpread = isKind<FragmentSpreadNode>(value, Kind.FRAGMENT_SPREAD);

      if (!isFragmentSpread) {
        return false;
      }

      const isIncluded = include.length > 0 && include.includes(value.name.value);
      const isExcluded = (include.length > 0 && !isIncluded) || exclude.includes(value.name.value);

      return isIncluded || !isExcluded;
      // Unable to pass generic into filter
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    }) ?? ([] as FragmentSpreadNode[])
  );
};

export const getFragmentSpreadsWithoutDirectives = (node: FieldNode | InlineFragmentNode | FragmentDefinitionNode) => {
  const fragmentSpreads = getFragmentSpreads(node);
  const isFragmentSpreadNode = (n: SelectionNode): n is FragmentSpreadNode => !n.directives?.length;

  return fragmentSpreads.reduce<FragmentSpreadNode[]>((withoutDirectives, spread) => {
    if (isFragmentSpreadNode(spread)) {
      withoutDirectives.push(spread);
    }

    return withoutDirectives;
  }, []);
};

export const resolveFragmentSpreads = (
  selectionNodes: readonly SelectionNode[],
  fragmentDefinitions: FragmentDefinitionNodeMap,
  maxDepth = 1,
  depth = 0,
  typeName?: string,
  fragmentKind?: string,
  fragmentName?: string,
): FieldAndTypeName[] => {
  let fieldAndTypeName: FieldAndTypeName[] = [];

  for (const selectionNode of selectionNodes) {
    if (isKind<FieldNode>(selectionNode, Kind.FIELD)) {
      fieldAndTypeName.push({ fieldNode: selectionNode, fragmentKind, fragmentName, typeName });
    } else if (isKind<FragmentSpreadNode>(selectionNode, Kind.FRAGMENT_SPREAD) && depth < maxDepth) {
      const { value: name } = selectionNode.name;
      const fragmentDefinition = fragmentDefinitions[name];

      if (fragmentDefinition) {
        const resolvedFieldAndTypeName = resolveFragmentSpreads(
          fragmentDefinition.selectionSet.selections,
          fragmentDefinitions,
          maxDepth,
          depth + 1,
          fragmentDefinition.typeCondition.name.value,
          Kind.FRAGMENT_SPREAD,
          name,
        );

        fieldAndTypeName = [...fieldAndTypeName, ...resolvedFieldAndTypeName];
      }
    }
  }

  return fieldAndTypeName;
};
