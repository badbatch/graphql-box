import { MaybeRawResponseData, PlainObjectMap } from "@graphql-box/core";
import { isObjectLike, keys } from "lodash";

const convertNullArrayEntriesToUndefined = (data: PlainObjectMap) => {
  const converter = (objectLike: PlainObjectMap | any[]) => {
    const isArray = Array.isArray(objectLike);

    return keys(objectLike).reduce((acc: PlainObjectMap, key) => {
      let value;

      if (isArray) {
        const index = Number(key);
        value = objectLike[index] === null ? undefined : objectLike[index];
      } else {
        value = objectLike[key];
      }

      if (isObjectLike(value)) {
        acc[key] = converter(value);
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
  };

  return converter(data);
};

export default (responseData: MaybeRawResponseData) => {
  const { data, path } = responseData;

  if (data && path) {
    return {
      ...responseData,
      data: convertNullArrayEntriesToUndefined(data),
    };
  }

  return responseData;
};