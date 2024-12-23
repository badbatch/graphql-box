import { type FieldNode } from 'graphql';
import { getAlias } from './alias.ts';

export const getAliasOrName = (field: FieldNode) => getAlias(field) ?? field.name.value;
