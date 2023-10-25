import { type ASTNode, type Kind } from 'graphql';

export const getKind = ({ kind }: ASTNode): Kind => {
  return kind;
};

export const isKind = <T extends ASTNode>(node: ASTNode, name: Kind): node is T => {
  return node.kind === name;
};
