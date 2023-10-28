import { isArray, isPlainObject } from '@graphql-box/helpers';
import { isNumber, isString } from 'lodash-es';

export const getDataValue = <T>(value: unknown, key: string | number): T | undefined => {
  if (isArray(value) && isNumber(key)) {
    return value[key] as T;
  }

  if (isPlainObject(value) && isString(key)) {
    return value[key] as T;
  }

  return;
};
