import { type ASTNode, type Kind } from 'graphql';

export const isKind = <T extends ASTNode>(node: ASTNode, name: Kind): node is T => {
  return node.kind === name;
};
