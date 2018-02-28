import {
  cloneDeep,
  isArray,
  isEqual,
  isObjectLike,
  mergeWith,
} from "lodash";

import { ObjectMap } from "../../types";

export type MergeObjectsMatcher = (key: string, value: any) => any;

export default function mergeObjects(obj: ObjectMap, src: ObjectMap, matcher: MergeObjectsMatcher): ObjectMap {
  function mergeCustomizer(objValue: any, srcValue: any, key: string): any[] | undefined {
    if (!isArray(objValue) || !isArray(srcValue)) return undefined;
    const objValues = objValue as any[];
    const srcValues = srcValue as any[];

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

  const objClone = cloneDeep(obj);
  return mergeWith(objClone, src, mergeCustomizer);
}
