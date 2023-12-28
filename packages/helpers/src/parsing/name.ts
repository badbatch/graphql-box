import { type ASTNode } from 'graphql';
import { NAME } from '../constants.ts';
import { type NamedASTNode } from '../types.ts';

export const getName = (node: ASTNode) => {
  if (!(NAME in node)) {
    return;
  }

  const { name } = node as NamedASTNode;
  return name?.value;
};
