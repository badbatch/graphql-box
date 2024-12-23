import { type CacheMetadata, type DehydratedCacheMetadata } from '@graphql-box/core';
import { Cacheability } from 'cacheability';
import { OperationTypeNode } from 'graphql';

export const dehydrateCacheMetadata = (cacheMetadata: CacheMetadata): DehydratedCacheMetadata => {
  const obj: DehydratedCacheMetadata = {};

  for (const [key, cacheability] of cacheMetadata.entries()) {
    obj[key] = cacheability.metadata;
  }

  return obj;
};

export const rehydrateCacheMetadata = (
  dehydratedCacheMetadata: DehydratedCacheMetadata,
  cacheMetadata: CacheMetadata = new Map(),
): CacheMetadata => {
  return Object.keys(dehydratedCacheMetadata).reduce<CacheMetadata>((map, key) => {
    const cacheability = new Cacheability({ metadata: dehydratedCacheMetadata[key] });
    map.set(key, cacheability);
    return map;
  }, cacheMetadata);
};

export const setCacheMetadata =
  (cacheMetadata: DehydratedCacheMetadata) =>
  (key: string, headers: Headers, operation: OperationTypeNode = OperationTypeNode.QUERY) => {
    cacheMetadata[`${operation}.${key}`] = new Cacheability({ headers }).metadata;
  };
