import { getName, isKind } from '@graphql-box/helpers';
import { type FieldNode, Kind } from 'graphql';
import { type Ancestor } from '../types.ts';
import { isAncestorAstNode } from './isAncestorAstNode.ts';

export const getRequestPathFromAncestors = (ancestors: Ancestor[]) => {
  return ancestors
    .reduce((path: string[], ancestor) => {
      if (isAncestorAstNode(ancestor) && isKind<FieldNode>(ancestor, Kind.FIELD)) {
        path.push(getName(ancestor)!);
      }

      return path;
    }, [])
    .join('.');
};
