import { isKind } from '@graphql-box/helpers';
import { type FragmentDefinitionNode, Kind } from 'graphql';
import type { Ancestor } from '../types.ts';
import { isAncestorAstNode } from './isAncestorAstNode.ts';

export const findAncestorFragmentDefinition = (ancestors: readonly Ancestor[]): FragmentDefinitionNode | undefined =>
  ancestors.find(
    ancestor => isAncestorAstNode(ancestor) && isKind<FragmentDefinitionNode>(ancestor, Kind.FRAGMENT_DEFINITION)
  ) as FragmentDefinitionNode | undefined;
