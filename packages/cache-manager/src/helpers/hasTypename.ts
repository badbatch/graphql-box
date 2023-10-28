import { TYPE_NAME_KEY, type TypedData } from '@graphql-box/core';
import { isObjectLike } from '@graphql-box/helpers';
import { isString } from 'lodash-es';

export const hasTypename = (value: unknown): value is TypedData => {
  if (!isObjectLike(value)) {
    return false;
  }

  return TYPE_NAME_KEY in value && isString(value[TYPE_NAME_KEY]);
};
