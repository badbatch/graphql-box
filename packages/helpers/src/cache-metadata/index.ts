import { CacheMetadata, DehydratedCacheMetadata, ValidOperations } from "@graphql-box/core";
import Cacheability from "cacheability";

export function dehydrateCacheMetadata(cacheMetadata: CacheMetadata): DehydratedCacheMetadata {
  const obj: DehydratedCacheMetadata = {};

  cacheMetadata.forEach((cacheability, key) => {
    obj[key] = cacheability.metadata;
  });

  return obj;
}

export function rehydrateCacheMetadata(
  dehydratedCacheMetadata: DehydratedCacheMetadata,
  cacheMetadata: CacheMetadata = new Map(),
): CacheMetadata {
  return Object.keys(dehydratedCacheMetadata).reduce((map: CacheMetadata, key: string) => {
    const cacheability = new Cacheability({ metadata: dehydratedCacheMetadata[key] });
    map.set(key, cacheability);
    return map;
  }, cacheMetadata);
}

export const setCacheMetadata = (cacheMetadata: DehydratedCacheMetadata) => (
  key: string,
  headers: Headers,
  operation: ValidOperations = "query",
) => {
  cacheMetadata[`${operation}.${key}`] = new Cacheability({ headers }).metadata;
};
