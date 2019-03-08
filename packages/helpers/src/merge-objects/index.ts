import {
  cloneDeep,
  isArray,
  isEqual,
  isObjectLike,
  mergeWith,
} from "lodash";

export default function mergeObjects<T>(obj: T, src: T, matcher: (key: string, value: any) => any): T {
  function mergeCustomizer(objValue: any, srcValue: any, key: string): any[] | undefined {
    if (!isArray(objValue) || !isArray(srcValue)) return undefined;
    const objValues = objValue;
    const srcValues = srcValue;

    srcValues.forEach((value, srcIndex) => {
      const match = matcher(key, value);

      if (!match) {
        if (isObjectLike(objValues[srcIndex]) && isObjectLike(value) && !isEqual(objValues[srcIndex], value)) {
          mergeWith(objValues[srcIndex], value, mergeCustomizer);
        } else {
          objValues[srcIndex] = value;
        }

        return;
      }

      const objIndex = objValues.findIndex((val) => matcher(key, val) === match);

      if (objIndex === -1) {
        objValues.push(value);
        return;
      }

      if (isObjectLike(objValues[objIndex]) && isObjectLike(value) && !isEqual(objValues[objIndex], value)) {
        mergeWith(objValues[objIndex], value, mergeCustomizer);
      } else {
        objValues[objIndex] = value;
      }
    });

    return objValues;
  }

  if (!obj) return cloneDeep(src);

  if (!src) return cloneDeep(obj);

  const objClone = cloneDeep(obj);
  return mergeWith(objClone, src, mergeCustomizer);
}
