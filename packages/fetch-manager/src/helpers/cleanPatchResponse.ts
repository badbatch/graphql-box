import { type PartialRawFetchData, type PlainData } from '@graphql-box/core';
import { isArray, isObjectLike } from '@graphql-box/helpers';

const convertNullArrayEntriesToUndefined = (data: PlainData) => {
  const converter = (value: PlainData) => {
    const isValueArray = isArray(value);

    return Object.keys(value).reduce<PlainData>(
      (acc, key) => {
        let entry: unknown;

        if (isValueArray) {
          const index = Number(key);
          entry = value[index] === null ? undefined : value[index];
        } else {
          entry = value[key];
        }

        const conditionallyConvert = () => (isObjectLike(entry) ? converter(entry) : entry);

        if (isArray(acc)) {
          acc[Number(key)] = conditionallyConvert();
        } else {
          acc[key] = conditionallyConvert();
        }

        return acc;
      },
      isValueArray ? [] : {},
    );
  };

  return converter(data);
};

export const cleanPatchResponse = (responseData: PartialRawFetchData): PartialRawFetchData => {
  const { data, paths } = responseData;

  if (data && paths) {
    return {
      ...responseData,
      data: convertNullArrayEntriesToUndefined(data),
    };
  }

  return responseData;
};
