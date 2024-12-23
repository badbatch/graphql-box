import { isArray, isPlainObject } from '@graphql-box/helpers';
import { isNumber, isString } from 'lodash-es';

export const getDataValue = <T>(value: unknown, key: string | number): T | undefined => {
  if (isArray(value) && isNumber(key)) {
    // Casting for ease of typing for consumers
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return value[key] as T;
  }

  if (isPlainObject(value) && isString(key)) {
    // Casting for ease of typing for consumers
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return value[key] as T;
  }

  return;
};
