import { isKind } from '@graphql-box/helpers';
import { type FragmentDefinitionNode, Kind } from 'graphql';
import type { Ancestor } from '../types.ts';
import { isAncestorAstNode } from './isAncestorAstNode.ts';

export const isAncestorFragmentDefinition = (ancestors: readonly Ancestor[]) =>
  ancestors.some(
    ancestor => isAncestorAstNode(ancestor) && isKind<FragmentDefinitionNode>(ancestor, Kind.FRAGMENT_DEFINITION)
  );
