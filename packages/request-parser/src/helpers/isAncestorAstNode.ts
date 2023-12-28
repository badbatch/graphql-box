import type { ASTNode } from 'graphql';
import { isArray } from 'lodash-es';

export const isAncestorAstNode = (ancestor: ASTNode | readonly ASTNode[] | undefined): ancestor is ASTNode =>
  !!ancestor && !isArray(ancestor);
