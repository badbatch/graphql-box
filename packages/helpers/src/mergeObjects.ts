import { cloneDeep, isArray, isEqual, isObjectLike, mergeWith } from 'lodash-es';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeObjects = <T>(obj: T, source: T, matcher: (key: string, value: any) => any): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeCustomizer = (objValue: any, sourceValue: any, key: string): any[] | undefined => {
    if (!isArray(objValue) || !isArray(sourceValue)) {
      return undefined;
    }

    for (const [sourceIndex, value] of sourceValue.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const match = matcher(key, value);

      if (!match) {
        if (isObjectLike(objValue[sourceIndex]) && isObjectLike(value) && !isEqual(objValue[sourceIndex], value)) {
          mergeWith(objValue[sourceIndex], value, mergeCustomizer);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          objValue[sourceIndex] = value;
        }

        continue;
      }

      const objIndex = objValue.findIndex(value_ => matcher(key, value_) === match);

      if (objIndex === -1) {
        objValue.push(value);
        continue;
      }

      if (isObjectLike(objValue[objIndex]) && isObjectLike(value) && !isEqual(objValue[objIndex], value)) {
        mergeWith(objValue[objIndex], value, mergeCustomizer);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        objValue[objIndex] = value;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return objValue;
  };

  if (!obj) {
    return cloneDeep(source);
  }

  if (!source) {
    return cloneDeep(obj);
  }

  const objClone = cloneDeep(obj);
  return mergeWith(objClone, source, mergeCustomizer);
};
