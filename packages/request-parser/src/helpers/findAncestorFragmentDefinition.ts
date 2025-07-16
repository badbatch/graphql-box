import { isKind } from '@graphql-box/helpers';
import { isAncestorAstNode } from '@graphql-box/helpers/src/isAncestorAstNode.ts';
import { type FragmentDefinitionNode, Kind } from 'graphql';
import { type Ancestor } from '../types.ts';

export const findAncestorFragmentDefinition = (ancestors: readonly Ancestor[]): FragmentDefinitionNode | undefined =>
  ancestors.find(
    ancestor => isAncestorAstNode(ancestor) && isKind<FragmentDefinitionNode>(ancestor, Kind.FRAGMENT_DEFINITION),
  );
