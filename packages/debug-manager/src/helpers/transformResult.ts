import { CacheMetadata, DehydratedCacheMetadata, MaybeRequestResult } from "@graphql-box/core";
import { dehydrateCacheMetadata } from "@graphql-box/helpers";

export default (result?: MaybeRequestResult & { cacheMetadata?: CacheMetadata }) => {
  if (!result) {
    return {};
  }

  const parseCacheMetadata = (cacheMetadata: CacheMetadata | DehydratedCacheMetadata) =>
    cacheMetadata instanceof Map ? dehydrateCacheMetadata(cacheMetadata) : cacheMetadata;

  const { _cacheMetadata, cacheMetadata, errors, ...rest } = result;

  return {
    result: JSON.stringify({
      ...(_cacheMetadata ? { _cacheMetadata: parseCacheMetadata(_cacheMetadata) } : {}),
      ...(cacheMetadata ? { cacheMetadata: parseCacheMetadata(cacheMetadata) } : {}),
      ...rest,
    }),
  };
};
