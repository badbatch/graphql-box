import { type FragmentDefinitionNodeMap } from '@graphql-box/core';
import { InternalError, isKind } from '@graphql-box/helpers';
import {
  type FieldNode,
  type FragmentDefinitionNode,
  type FragmentSpreadNode,
  type InlineFragmentNode,
  Kind,
} from 'graphql';
import { directivesHasIncludeFalseOrSkipTrue } from '#helpers/directivesHasIncludeFalseOrSkipTrue.ts';
import { type NormalisedVariables } from '#helpers/normaliseVariables.ts';

export const replaceFragmentSpreadsWithDefinitionFields = <
  T extends FieldNode | InlineFragmentNode | FragmentDefinitionNode,
>(
  node: T,
  fragmentDefinitions: FragmentDefinitionNodeMap | undefined,
  normalisedVariables: NormalisedVariables,
): T => {
  if (!node.selectionSet) {
    return node;
  }

  for (let i = node.selectionSet.selections.length - 1; i >= 0; i--) {
    const childNode = node.selectionSet.selections[i];

    if (!childNode) {
      continue;
    }

    if (isKind<FragmentSpreadNode>(childNode, Kind.FRAGMENT_SPREAD)) {
      const selections = [...node.selectionSet.selections];

      if (directivesHasIncludeFalseOrSkipTrue(childNode, normalisedVariables)) {
        selections.splice(i, 1);
        continue;
      }

      const { value: name } = childNode.name;
      const fragmentDefinition = fragmentDefinitions?.[name];

      if (!fragmentDefinition) {
        throw new InternalError(`Could not find matching fragment definition for fragment spread "${name}".`);
      }

      const fragmentDefinitionClone = structuredClone(fragmentDefinition);

      const replaced = replaceFragmentSpreadsWithDefinitionFields(
        fragmentDefinitionClone,
        fragmentDefinitions,
        normalisedVariables,
      );

      selections.splice(i, 1, ...replaced.selectionSet.selections);
      node.selectionSet.selections = selections;
    }
  }

  return node;
};
