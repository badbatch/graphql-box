import { type CacheMetadata, type DehydratedCacheMetadata, type PartialRequestResult } from '@graphql-box/core';
import { dehydrateCacheMetadata } from '@graphql-box/helpers';

export const transformResult = (result?: PartialRequestResult & { cacheMetadata?: CacheMetadata }) => {
  if (!result) {
    return {};
  }

  const parseCacheMetadata = (cacheMetadata: CacheMetadata | DehydratedCacheMetadata) =>
    cacheMetadata instanceof Map ? dehydrateCacheMetadata(cacheMetadata) : cacheMetadata;

  const { _cacheMetadata, cacheMetadata, errors, ...rest } = result;

  return {
    result: {
      ...(_cacheMetadata ? { _cacheMetadata: parseCacheMetadata(_cacheMetadata) } : {}),
      ...(cacheMetadata ? { cacheMetadata: parseCacheMetadata(cacheMetadata) } : {}),
      ...rest,
    },
  };
};
