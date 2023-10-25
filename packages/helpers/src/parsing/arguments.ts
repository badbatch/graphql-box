import { type PlainObject, type RequestOptions } from '@graphql-box/core';
import { type DirectiveNode, type FieldNode, Kind, type ValueNode } from 'graphql';
import { VALUE } from '../constants.ts';
import { getKind } from './kind.ts';
import { getName } from './name.ts';

type ParseValueResult = string | boolean | null | PlainObject | ParseValueResult[];

const parseValue = (valueNode: ValueNode): ParseValueResult => {
  let output: ParseValueResult;

  if (VALUE in valueNode) {
    const scalarValueNode = valueNode;
    output = scalarValueNode.value;
  } else if (valueNode.kind === Kind.OBJECT) {
    const objectValueNode = valueNode;
    const obj: PlainObject = {};

    for (const { name, value } of objectValueNode.fields) {
      obj[name.value] = parseValue(value);
    }

    output = obj;
  } else if (valueNode.kind === Kind.LIST) {
    const listValueNode = valueNode;
    const array: ParseValueResult[] = [];

    for (const value of listValueNode.values) {
      array.push(parseValue(value));
    }

    output = array;
  } else {
    output = null;
  }

  return output;
};

export const getArguments = (field: FieldNode | DirectiveNode, options?: RequestOptions): PlainObject | undefined => {
  if (!field.arguments || field.arguments.length === 0) {
    return undefined;
  }

  const args: PlainObject = {};

  for (const { name, value } of field.arguments) {
    if (getKind(value) === Kind.VARIABLE && options?.variables) {
      const variableName = getName(value);

      if (variableName) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        args[name.value] = options.variables[variableName];
      }
    } else {
      args[name.value] = parseValue(value);
    }
  }

  return args;
};
