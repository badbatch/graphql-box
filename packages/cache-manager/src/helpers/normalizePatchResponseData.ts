import { type RawResponseDataWithMaybeCacheMetadata } from '@graphql-box/core';
import { isString, set } from 'lodash-es';
import { type CacheManagerContext } from '../types.ts';

export const normalizePatchResponseData = (
  rawResponseData: RawResponseDataWithMaybeCacheMetadata,
  context: CacheManagerContext
) => {
  if (!context.normalizePatchResponseData) {
    return rawResponseData;
  }

  const { data, paths, ...rest } = rawResponseData;

  if (!paths?.length || !isString(paths[0])) {
    return rawResponseData;
  }

  return {
    ...rest,
    data: set({}, paths[0], data),
    paths,
  };
};
