import { isKind } from '@graphql-box/helpers';
import { isAncestorAstNode } from '@graphql-box/helpers/src/isAncestorAstNode.ts';
import { type FragmentDefinitionNode, Kind } from 'graphql';
import { type Ancestor } from '../types.ts';

export const sliceAncestorsFromFragmentDefinition = (ancestors: readonly Ancestor[]) => {
  const index = ancestors.findIndex(
    ancestor => isAncestorAstNode(ancestor) && isKind<FragmentDefinitionNode>(ancestor, Kind.FRAGMENT_DEFINITION),
  );

  return ancestors.slice(index + 1);
};
