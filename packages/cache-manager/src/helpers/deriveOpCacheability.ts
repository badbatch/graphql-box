import { CacheMetadata } from "@graphql-box/core";
import Cacheability from "cacheability";
import { HEADER_CACHE_CONTROL } from "../consts";

export type Params = {
  cacheMetadata: CacheMetadata;
  fallback: string;
  headers?: Headers;
};

export default ({ cacheMetadata, fallback, headers }: Params): Cacheability => {
  if (!!cacheMetadata.size) {
    const [first, ...rest] = Object.values(cacheMetadata);

    return new Cacheability({
      metadata: rest.reduce((acc, metadata) => {
        if (metadata.ttl < acc.ttl) {
          return metadata;
        }

        return acc;
      }, first),
    });
  }

  if (headers && headers.has(HEADER_CACHE_CONTROL)) {
    return new Cacheability({ headers });
  }

  return new Cacheability({ cacheControl: fallback });
};
