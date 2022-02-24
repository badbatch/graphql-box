import { MaybeRawResponseData } from "@graphql-box/core";
import { castArray, merge } from "lodash";

export default (responseDataSets: MaybeRawResponseData[]): MaybeRawResponseData => {
  return responseDataSets.reduce((acc, dataSet, index) => {
    const { _cacheMetadata, data, errors, hasNext, headers, path } = dataSet;

    if (_cacheMetadata) {
      acc._cacheMetadata = acc._cacheMetadata ? { ...acc._cacheMetadata, ..._cacheMetadata } : _cacheMetadata;
    }

    if (data) {
      acc.data = acc.data ? merge(acc.data, data) : data;
    }

    const castErrors = castArray(errors);

    if (castErrors.length) {
      if (!acc.errors) {
        acc.errors = [];
      }

      (acc.errors as Error[]).push(...castErrors);
    }

    if (index === 0) {
      acc.headers = headers;
    }

    if (index === responseDataSets.length - 1) {
      acc.hasNext = hasNext;
    }

    if (path) {
      if (!acc.path) {
        acc.path = [];
      }

      (acc.path as (string | number)[][]).push(path as (string | number)[]);
    }

    return acc;
  }, {});
};
