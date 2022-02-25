import { MaybeRawResponseData } from "@graphql-box/core";
import { castArray, merge } from "lodash";

export default (responseDataSets: MaybeRawResponseData[]): MaybeRawResponseData => {
  return responseDataSets.reduce((acc, dataSet, index) => {
    const { _cacheMetadata, data, errors, hasNext, headers, paths } = dataSet;

    if (_cacheMetadata) {
      acc._cacheMetadata = acc._cacheMetadata ? { ...acc._cacheMetadata, ..._cacheMetadata } : _cacheMetadata;
    }

    if (data) {
      acc.data = acc.data ? merge(acc.data, data) : data;
    }

    if (errors) {
      const castErrors = castArray(errors);

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

    if (paths) {
      if (!acc.paths) {
        acc.paths = [];
      }

      acc.paths.push(paths[0]);
    }

    return acc;
  }, {});
};
