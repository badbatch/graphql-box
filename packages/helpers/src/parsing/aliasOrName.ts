import { type FieldNode } from 'graphql';
import { getAlias } from './alias.ts';
import { getName } from './name.ts';

export const getAliasOrName = (field: FieldNode) => getAlias(field) ?? getName(field)!;
