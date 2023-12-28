import { type FieldNode } from 'graphql';

export const getAlias = ({ alias }: FieldNode): string | undefined => alias?.value;
