import { type PlainData } from '@graphql-box/core';
import { isObjectLike } from '@graphql-box/helpers';
import { get } from 'lodash-es';

export const hasRequestPathChanged = (requestPath: string, data: PlainData | null | undefined) => {
  if (!data) {
    return false;
  }

  let slice: unknown = data;

  return requestPath.split('.').reduce((acc, key) => {
    if (acc) {
      return acc;
    }

    if (!isObjectLike(slice) || !(key in slice)) {
      return true;
    }

    slice = get(slice, key);
    return false;
  }, false);
};
