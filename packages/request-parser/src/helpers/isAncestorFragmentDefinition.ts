import { isKind } from '@graphql-box/helpers';
import { isAncestorAstNode } from '@graphql-box/helpers/src/isAncestorAstNode.ts';
import { type FragmentDefinitionNode, Kind } from 'graphql';
import { type Ancestor } from '../types.ts';

export const isAncestorFragmentDefinition = (ancestors: readonly Ancestor[]) =>
  ancestors.some(
    ancestor => isAncestorAstNode(ancestor) && isKind<FragmentDefinitionNode>(ancestor, Kind.FRAGMENT_DEFINITION),
  );
