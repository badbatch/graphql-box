import { type FragmentDefinitionNodeMap, type PlainObject } from '@graphql-box/core';
import { isKind } from '@graphql-box/helpers';
import {
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type InlineFragmentNode,
  Kind,
  type VariableNode,
} from 'graphql';
import { type Jsonifiable } from 'type-fest';
import { replaceVariableNodeWithValueNode } from '#helpers/replaceVariableNodeWithValueNode.ts';
import { type VariableTypesMap } from '#types.ts';

export const replaceFragmentSpreadsWithDefinitionFields = <
  T extends FieldNode | InlineFragmentNode | FragmentDefinitionNode,
>(
  node: T,
  fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
  variableTypes: VariableTypesMap,
  variableValues: PlainObject<Jsonifiable>,
): T => {
  if (!node.selectionSet) {
    return node;
  }

  for (let i = node.selectionSet.selections.length - 1; i >= 0; i--) {
    const childNode = node.selectionSet.selections[i];

    if (!childNode) {
      continue;
    }

    if (isKind<FieldNode>(childNode, Kind.FIELD) && childNode.arguments?.length) {
      for (const argumentNode of childNode.arguments) {
        if (isKind<VariableNode>(argumentNode.value, Kind.VARIABLE)) {
          const variableName = argumentNode.value.name.value;

          // @ts-expect-error does not cause a runtime exception
          argumentNode.value = replaceVariableNodeWithValueNode(
            variableTypes[variableName],
            variableValues[variableName],
          );
        }
      }
    }

    if (isKind<FragmentSpreadNode>(childNode, Kind.FRAGMENT_SPREAD)) {
      const { value: name } = childNode.name;
      const fragmentDefinition = fragmentDefinitions?.[name];

      if (!fragmentDefinition) {
        throw new Error(`Could not find matching fragment definition for fragment spread "${name}".`);
      }

      const selections = [...node.selectionSet.selections];

      selections.splice(
        i,
        1,
        ...replaceFragmentSpreadsWithDefinitionFields(
          fragmentDefinition,
          fragmentDefinitions,
          variableTypes,
          variableValues,
        ).selectionSet.selections,
      );

      node.selectionSet.selections = selections;
    }
  }

  return node;
};
