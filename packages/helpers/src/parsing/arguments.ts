import { type PlainObject } from '@graphql-box/core';
import { type DirectiveNode, type FieldNode, valueFromASTUntyped } from 'graphql';

export const getArguments = (node: FieldNode | DirectiveNode): PlainObject<unknown> | undefined => {
  if (!node.arguments || node.arguments.length === 0) {
    return undefined;
  }

  const args: PlainObject<unknown> = {};

  for (const { name, value } of node.arguments) {
    args[name.value] = valueFromASTUntyped(value);
  }

  return args;
};

export const hasArguments = (node: FieldNode | DirectiveNode): boolean =>
  Object.keys(getArguments(node) ?? {}).length > 0;
