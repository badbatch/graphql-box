import { type Ancestor } from '@graphql-box/core';
import { type FieldNode, type InlineFragmentNode, Kind } from 'graphql';
import { isAncestorAstNode } from '#isAncestorAstNode.ts';
import { getAlias } from '#parsing/alias.ts';
import { getKind } from '#parsing/kind.ts';

const isAncestorFieldNode = (ancestor: Ancestor): ancestor is FieldNode =>
  isAncestorAstNode(ancestor) && getKind(ancestor) === Kind.FIELD;

const isAncestorInlineFragmentNode = (ancestor: Ancestor): ancestor is InlineFragmentNode =>
  isAncestorAstNode(ancestor) && getKind(ancestor) === Kind.INLINE_FRAGMENT;

export const buildAncestorFieldNames = (ancestors: readonly Ancestor[]): string[] => {
  const fieldNames: string[] = [];

  for (const ancestor of ancestors) {
    if (isAncestorFieldNode(ancestor)) {
      fieldNames.push(getAlias(ancestor) ?? ancestor.name.value);
    } else if (isAncestorInlineFragmentNode(ancestor) && ancestor.typeCondition) {
      fieldNames.push(ancestor.typeCondition.name.value);
    }
  }

  return fieldNames;
};
