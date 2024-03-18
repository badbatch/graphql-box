import { isKind } from '@graphql-box/helpers';
import { type FieldNode, Kind } from 'graphql';
import { type Ancestor } from '../types.ts';
import { isAncestorAstNode } from './isAncestorAstNode.ts';

export const getFieldsFromAncestors = (ancestors: Ancestor[]) => {
  return ancestors.reduce((fields: FieldNode[], ancestor) => {
    if (isAncestorAstNode(ancestor) && isKind<FieldNode>(ancestor, Kind.FIELD)) {
      fields.push(ancestor);
    }

    return fields;
  }, []);
};
