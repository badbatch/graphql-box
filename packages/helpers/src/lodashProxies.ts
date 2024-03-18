import { type PlainArray, type PlainObject } from '@graphql-box/core';
import { isArray as lodashIsArray, isPlainObject as lodashIsPlainObject } from 'lodash-es';

export const isArray = (value: unknown): value is PlainArray => {
  return lodashIsArray(value);
};

export const isObjectLike = (value: unknown): value is PlainArray | PlainObject => {
  return isArray(value) || isPlainObject(value);
};

export const isPlainObject = (value: unknown): value is PlainObject => {
  return lodashIsPlainObject(value);
};
