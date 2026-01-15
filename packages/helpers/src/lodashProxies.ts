import { type PlainArray, type PlainObject } from '@graphql-box/core';
import { isArray as lodashIsArray, isPlainObject as lodashIsPlainObject } from 'lodash-es';

export const isArray = <T = unknown>(value: unknown): value is PlainArray<T> => {
  return lodashIsArray(value);
};

export const isObjectLike = <T = unknown>(value: unknown): value is PlainArray<T> | PlainObject<T> => {
  return isArray(value) || isPlainObject(value);
};

export const isPlainObject = <T = unknown>(value: unknown): value is PlainObject<T> => {
  return lodashIsPlainObject(value);
};
