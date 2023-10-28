import type { PlainData } from '@graphql-box/core';
import { isArray, isPlainObject } from '@graphql-box/helpers';
import { isNumber, isString } from 'lodash-es';

const checkValue = (value: unknown, typeIDKey: string): boolean => {
  if (isArray(value)) {
    return value.reduce<boolean>((acc, entry) => {
      if (!acc) {
        return false;
      }

      return checkValue(entry, typeIDKey);
    }, true);
  }

  if (isPlainObject(value)) {
    return recursivelyCheckProps(value, typeIDKey);
  }

  return false;
};

const recursivelyCheckProps = (data: PlainData, typeIDKey: string): boolean => {
  const keys = isPlainObject(data) ? Object.keys(data) : [...data.keys()];

  if (keys.length === 1 && isPlainObject(data) && !!data[typeIDKey]) {
    return true;
  }

  return keys.reduce<boolean>((acc, key) => {
    if (!acc) {
      return false;
    }

    if (isNumber(key) && isArray(data)) {
      return checkValue(data[key], typeIDKey);
    } else if (isString(key) && isPlainObject(data)) {
      return checkValue(data[key], typeIDKey);
    }

    return acc;
  }, true);
};

export const areOnlyPopulatedFieldsTypeIdKeys = (data: PlainData, typeIDKey: string) => {
  return recursivelyCheckProps(data, typeIDKey);
};
