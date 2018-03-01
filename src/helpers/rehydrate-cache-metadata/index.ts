import { Cacheability } from "cacheability";
import { CacheMetadata, DehydratedCacheMetadata } from "../../types";

export default function rehydrateCacheMetadata(dehydratedCacheMetadata: DehydratedCacheMetadata): CacheMetadata {
  const cacheMetadata: CacheMetadata = new Map();

  Object.keys(dehydratedCacheMetadata).forEach((key) => {
    const cacheability = new Cacheability();
    cacheability.metadata = dehydratedCacheMetadata[key];
    cacheMetadata.set(key, cacheability);
  });

  return cacheMetadata;
}
