import { type Ancestor } from '@graphql-box/core';
import { type FieldNode, Kind } from 'graphql';
import { isAncestorAstNode } from '#isAncestorAstNode.ts';
import { getAlias } from '#parsing/alias.ts';
import { getKind } from '#parsing/kind.ts';

const isAncestorFieldNode = (ancestor: Ancestor): ancestor is FieldNode =>
  isAncestorAstNode(ancestor) && getKind(ancestor) === Kind.FIELD;

export const buildAncestorFieldNames = (ancestors: readonly Ancestor[]): string[] => {
  const fieldNames: string[] = [];

  for (const ancestor of ancestors) {
    if (isAncestorFieldNode(ancestor)) {
      fieldNames.push(getAlias(ancestor) ?? ancestor.name.value);
    }
  }

  return fieldNames;
};
