import { type CacheMetadata, type DehydratedCacheMetadata, type ValidOperations } from '@graphql-box/core';
import { Cacheability } from 'cacheability';

export const dehydrateCacheMetadata = (cacheMetadata: CacheMetadata): DehydratedCacheMetadata => {
  const obj: DehydratedCacheMetadata = {};

  for (const [key, cacheability] of cacheMetadata.entries()) {
    obj[key] = cacheability.metadata;
  }

  return obj;
};

export const rehydrateCacheMetadata = (
  dehydratedCacheMetadata: DehydratedCacheMetadata,
  cacheMetadata: CacheMetadata = new Map()
): CacheMetadata => {
  return Object.keys(dehydratedCacheMetadata).reduce((map: CacheMetadata, key: string) => {
    const cacheability = new Cacheability({ metadata: dehydratedCacheMetadata[key] });
    map.set(key, cacheability);
    return map;
  }, cacheMetadata);
};

export const setCacheMetadata =
  (cacheMetadata: DehydratedCacheMetadata) =>
  (key: string, headers: Headers, operation: ValidOperations = 'query') => {
    cacheMetadata[`${operation}.${key}`] = new Cacheability({ headers }).metadata;
  };
