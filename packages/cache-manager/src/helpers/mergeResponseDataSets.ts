import { type RawResponseDataWithMaybeCacheMetadata } from '@graphql-box/core';
import { merge } from 'lodash-es';

export const mergeResponseDataSets = (responseDataSets: RawResponseDataWithMaybeCacheMetadata[]) => {
  return responseDataSets.reduce<RawResponseDataWithMaybeCacheMetadata>(
    (acc, dataSet, index) => {
      const { _cacheMetadata, data, hasNext, headers, paths } = dataSet;

      if (_cacheMetadata) {
        acc._cacheMetadata = acc._cacheMetadata ? { ...acc._cacheMetadata, ..._cacheMetadata } : _cacheMetadata;
      }

      acc.data = merge(acc.data, data);

      if (index === 0) {
        acc.headers = headers;
      }

      if (index === responseDataSets.length - 1) {
        acc.hasNext = hasNext;
      }

      if (paths) {
        acc.paths ??= [];
        acc.paths.push(...paths);
      }

      return acc;
    },
    { data: {} },
  );
};
