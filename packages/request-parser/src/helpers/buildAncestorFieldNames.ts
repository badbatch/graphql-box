import { getAlias, getKind } from '@graphql-box/helpers';
import { type FieldNode, Kind } from 'graphql';
import { isAncestorAstNode } from '#helpers/isAncestorAstNode.ts';
import { type Ancestor } from '#types.ts';

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
