import { isEqual, mergeWith } from 'lodash-es';
import { isArray, isObjectLike } from './lodashProxies.ts';

export const mergeObjects = <T extends object>(
  obj: T,
  source: T,
  matcher: (key: string, value: unknown) => unknown,
): T => {
  const mergeCustomizer = (destinationValue: unknown, sourceValue: unknown, key: string): unknown[] | undefined => {
    if (!isArray(destinationValue) || !isArray(sourceValue)) {
      return undefined;
    }

    for (const [sourceIndex, value] of sourceValue.entries()) {
      const match = matcher(key, value);

      if (!match) {
        if (
          isObjectLike(destinationValue[sourceIndex]) &&
          isObjectLike(value) &&
          !isEqual(destinationValue[sourceIndex], value)
        ) {
          mergeWith(destinationValue[sourceIndex], value, mergeCustomizer);
        } else {
          destinationValue[sourceIndex] = value;
        }

        continue;
      }

      const objIndex = destinationValue.findIndex(entry => matcher(key, entry) === match);

      if (objIndex === -1) {
        destinationValue.push(value);
        continue;
      }

      if (
        isObjectLike(destinationValue[objIndex]) &&
        isObjectLike(value) &&
        !isEqual(destinationValue[objIndex], value)
      ) {
        mergeWith(destinationValue[objIndex], value, mergeCustomizer);
      } else {
        destinationValue[objIndex] = value;
      }
    }

    return destinationValue;
  };

  const objClone = structuredClone(obj);
  return mergeWith(objClone, source, mergeCustomizer);
};
