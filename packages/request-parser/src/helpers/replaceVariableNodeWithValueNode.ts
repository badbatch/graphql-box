import { type Maybe, type PlainArray, type PlainData, type PlainObject } from '@graphql-box/core';
import { isObjectLike, isPlainObject } from '@graphql-box/helpers';
import { GraphQLEnumType, type GraphQLNamedType, type ValueNode, parseValue } from 'graphql';
import { isString } from 'lodash-es';
import { type Jsonifiable } from 'type-fest';

const parseArrayToInputString = (values: PlainArray, variableType: Maybe<GraphQLNamedType>): string => {
  let inputString = '[';

  for (const [index, value] of values.entries()) {
    if (isObjectLike(value)) {
      inputString += parseToInputString(value, variableType);
    } else {
      const sanitizedValue =
        isString(value) && !(variableType instanceof GraphQLEnumType) ? `"${value}"` : String(value);

      inputString += sanitizedValue;
    }

    if (index < values.length - 1) {
      inputString += ',';
    }
  }

  inputString += ']';
  return inputString;
};

const parseObjectToInputString = (obj: PlainObject, variableType: Maybe<GraphQLNamedType>): string => {
  let inputString = '{';
  const keys = Object.keys(obj);

  for (const [index, key] of keys.entries()) {
    inputString += `${key}:`;
    // Result of needing to keep PlainObject as generic as possible.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value = obj[key];

    if (isObjectLike(value)) {
      inputString += parseToInputString(value, variableType);
    } else {
      inputString += isString(value) ? `"${value}"` : String(value);
    }

    if (index < keys.length - 1) {
      inputString += ',';
    }
  }

  inputString += '}';
  return inputString;
};

const parseToInputString = (value: PlainData, variableType: Maybe<GraphQLNamedType>): string => {
  if (isPlainObject(value)) {
    return parseObjectToInputString(value, variableType);
  }

  return parseArrayToInputString(value, variableType);
};

export const replaceVariableNodeWithValueNode = (
  variableType: Maybe<GraphQLNamedType>,
  variableValue?: Jsonifiable,
): ValueNode => {
  if (variableValue === undefined) {
    return parseValue('null');
  }

  if (isObjectLike(variableValue)) {
    return parseValue(parseToInputString(variableValue, variableType));
  }

  const sanitizedValue =
    isString(variableValue) && !(variableType instanceof GraphQLEnumType)
      ? `"${variableValue}"`
      : String(variableValue);

  return parseValue(sanitizedValue);
};
