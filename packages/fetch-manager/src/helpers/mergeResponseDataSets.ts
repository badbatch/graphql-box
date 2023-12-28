import { type PartialRawFetchData } from '@graphql-box/core';
import { isString, merge } from 'lodash-es';
import { cleanPatchResponse } from './cleanPatchResponse.ts';

export const mergeResponseDataSets = (responseDataSets: PartialRawFetchData[]): PartialRawFetchData => {
  return responseDataSets.reduce((acc, dataSet, index) => {
    const { _cacheMetadata, data, errors, hasNext, headers, paths } = cleanPatchResponse(dataSet);

    if (_cacheMetadata) {
      acc._cacheMetadata = acc._cacheMetadata ? { ...acc._cacheMetadata, ..._cacheMetadata } : _cacheMetadata;
    }

    if (data) {
      acc.data = acc.data ? merge(acc.data, data) : data;
    }

    if (errors?.length) {
      if (!acc.errors) {
        acc.errors = [];
      }

      acc.errors.push(...errors);
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

      if (isString(paths[0])) {
        acc.paths.push(paths[0]);
      }
    }

    return acc;
  }, {});
};
