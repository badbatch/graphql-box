import { isPlainObject } from '@graphql-box/helpers';
import { set } from 'lodash-es';
import { isRef } from '#helpers/isRef.ts';

export const mergeCacheValues = <T = unknown>(existingCacheValue: T, incomingCacheValue: T): T => {
  switch (true) {
    case incomingCacheValue === undefined || incomingCacheValue === null: {
      return existingCacheValue;
    }

    case isRef(incomingCacheValue): {
      return incomingCacheValue;
    }

    case isPlainObject(incomingCacheValue) && isPlainObject(existingCacheValue): {
      if (isRef(existingCacheValue)) {
        return incomingCacheValue;
      }

      for (const [key, value] of Object.entries(incomingCacheValue)) {
        const existingValue: unknown = existingCacheValue[key];
        set(existingCacheValue, key, mergeCacheValues(existingValue, value));
      }

      return existingCacheValue;
    }

    default: {
      return incomingCacheValue;
    }
  }
};
