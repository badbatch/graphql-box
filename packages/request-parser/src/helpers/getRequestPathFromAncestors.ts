import { isKind } from '@graphql-box/helpers';
import { type FieldNode, Kind } from 'graphql';
import { type Ancestor } from '../types.ts';
import { isAncestorAstNode } from './isAncestorAstNode.ts';

export const getRequestPathFromAncestors = (ancestors: Ancestor[]) => {
  return ancestors
    .reduce((path: string[], ancestor) => {
      if (isAncestorAstNode(ancestor) && isKind<FieldNode>(ancestor, Kind.FIELD)) {
        path.push(ancestor.name.value);
      }

      return path;
    }, [])
    .join('.');
};
