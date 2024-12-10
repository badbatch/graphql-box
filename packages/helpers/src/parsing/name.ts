import { type ASTNode } from 'graphql';
import { type NamedASTNode } from '../types.ts';

export const getName = (node: ASTNode) => {
  if (!('name' in node)) {
    return;
  }

  // If 'name' is a property, it is a NamedASTNode
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const { name } = node as NamedASTNode;
  return name?.value;
};
