import { type FragmentDefinitionNodeMap } from '@graphql-box/core';
import { isKind } from '@graphql-box/helpers';
import {
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type InlineFragmentNode,
  Kind,
} from 'graphql';

export const replaceFragmentSpreadsWithDefinitionFields = <
  T extends FieldNode | InlineFragmentNode | FragmentDefinitionNode,
>(
  node: T,
  fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
): T => {
  if (!node.selectionSet) {
    return node;
  }

  for (let i = node.selectionSet.selections.length - 1; i >= 0; i--) {
    const childNode = node.selectionSet.selections[i];

    if (childNode && isKind<FragmentSpreadNode>(childNode, Kind.FRAGMENT_SPREAD)) {
      const { value: name } = childNode.name;
      const fragmentDefinition = fragmentDefinitions?.[name];

      if (!fragmentDefinition) {
        throw new Error(`Could not find matching fragment definition for fragment spread "${name}".`);
      }

      const selections = [...node.selectionSet.selections];

      selections.splice(
        i,
        1,
        ...replaceFragmentSpreadsWithDefinitionFields(fragmentDefinition, fragmentDefinitions).selectionSet.selections,
      );

      node.selectionSet.selections = selections;
    }
  }

  return node;
};
