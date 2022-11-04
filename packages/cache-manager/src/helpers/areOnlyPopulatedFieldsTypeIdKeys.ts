import { PlainObjectMap } from "@graphql-box/core";
import { isArray, isPlainObject } from "lodash";

const checkValue = (value: any, typeIDKey: string): boolean => {
  if (isArray(value)) {
    return value.reduce((accB, entry) => {
      if (!accB) {
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

const recursivelyCheckProps = (data: PlainObjectMap, typeIDKey: string): boolean => {
  const keys = Object.keys(data);

  if (keys.length === 1 && !!data[typeIDKey]) {
    return true;
  }

  return keys.reduce((accA, key) => {
    if (!accA) {
      return false;
    }

    return checkValue(data[key], typeIDKey);
  }, true);
};

export default (data: PlainObjectMap, typeIDKey: string) => {
  return recursivelyCheckProps(data, typeIDKey);
};
