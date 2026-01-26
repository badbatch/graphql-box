import { type FragmentDefinitionNodeMap } from '@graphql-box/core';
import { type DocumentNode, type FragmentDefinitionNode, Kind } from 'graphql';
import { isEmpty } from 'lodash-es';
import { isKind } from './kind.ts';

export const getFragmentDefinitions = ({ definitions }: DocumentNode): FragmentDefinitionNodeMap | undefined => {
  const fragmentDefinitions: FragmentDefinitionNodeMap = {};

  for (const node of definitions) {
    if (isKind<FragmentDefinitionNode>(node, Kind.FRAGMENT_DEFINITION)) {
      const name = node.name.value;
      fragmentDefinitions[name] = node;
    }
  }

  if (isEmpty(fragmentDefinitions)) {
    return undefined;
  }

  return fragmentDefinitions;
};
