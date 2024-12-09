import { type FragmentDefinitionNodeMap } from '@graphql-box/core';
import {
  type DocumentNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type InlineFragmentNode,
  Kind,
} from 'graphql';
import { isEmpty } from 'lodash-es';
import { isKind } from './kind.ts';
import { getName } from './name.ts';

export const deleteFragmentDefinitions = (
  documentNode: DocumentNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) => {
  const definitions = [...documentNode.definitions];

  for (let index = definitions.length - 1; index >= 0; index -= 1) {
    const definitionNode = definitions[index];

    if (!definitionNode) {
      continue;
    }

    const isFragmentDefinition = isKind<FragmentDefinitionNode>(definitionNode, Kind.FRAGMENT_DEFINITION);

    if (!isFragmentDefinition) {
      continue;
    }

    const isIncluded = include.length > 0 && include.includes(getName(definitionNode)!);
    const isExcluded = (include.length > 0 && !isIncluded) || exclude.includes(getName(definitionNode)!);

    if (isIncluded || !isExcluded) {
      definitions.splice(index, 1);
    }
  }

  return {
    ...documentNode,
    definitions,
  };
};

export const getFragmentDefinitions = ({ definitions }: DocumentNode): FragmentDefinitionNodeMap | undefined => {
  const fragmentDefinitions: FragmentDefinitionNodeMap = {};

  for (const value of definitions) {
    if (isKind<FragmentDefinitionNode>(value, Kind.FRAGMENT_DEFINITION)) {
      const name = getName(value);

      if (!name) {
        continue;
      }

      fragmentDefinitions[name] = value;
    }
  }

  if (isEmpty(fragmentDefinitions)) {
    return undefined;
  }

  return fragmentDefinitions;
};

export const setFragmentDefinitions = (
  fragmentDefinitions: FragmentDefinitionNodeMap,
  node: FieldNode | InlineFragmentNode | FragmentDefinitionNode,
  { exclude = [], include = [] }: { exclude?: string[]; include?: string[] } = {},
) => {
  let fragmentsSet = 0;

  if (!node.selectionSet) {
    return fragmentsSet;
  }

  const selections = [...node.selectionSet.selections];

  for (let index = selections.length - 1; index >= 0; index -= 1) {
    const selectionNode = selections[index];

    if (!selectionNode) {
      continue;
    }

    const isFragmentSpread = isKind<FragmentSpreadNode>(selectionNode, Kind.FRAGMENT_SPREAD);

    if (!isFragmentSpread) {
      continue;
    }

    const name = getName(selectionNode)!;
    const isIncluded = include.length > 0 && include.includes(name);
    const isExcluded = (include.length > 0 && !isIncluded) || exclude.includes(name);

    if (isIncluded || !isExcluded) {
      const fragmentDefinition = fragmentDefinitions[name];

      if (!fragmentDefinition) {
        continue;
      }

      const { selectionSet } = fragmentDefinition;
      selections.splice(index, 1, ...selectionSet.selections);
      fragmentsSet += 1;
    }
  }

  node.selectionSet.selections = selections;
  return fragmentsSet;
};
