import { isKind } from '@graphql-box/helpers';
import { type FragmentDefinitionNode, Kind } from 'graphql';
import type { Ancestor } from '../types.ts';
import { isAncestorAstNode } from './isAncestorAstNode.ts';

export const sliceAncestorsFromFragmentDefinition = (ancestors: readonly Ancestor[]) => {
  const index = ancestors.findIndex(
    ancestor => isAncestorAstNode(ancestor) && isKind<FragmentDefinitionNode>(ancestor, Kind.FRAGMENT_DEFINITION)
  );

  return ancestors.slice(index + 1);
};
