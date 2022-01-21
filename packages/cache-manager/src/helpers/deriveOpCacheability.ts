import { DehydratedCacheMetadata } from "@graphql-box/core";
import Cacheability from "cacheability";
import { isEmpty } from "lodash";
import { HEADER_CACHE_CONTROL } from "../consts";

export type Params = {
  _cacheMetadata?: DehydratedCacheMetadata;
  fallback: string;
  headers?: Headers;
};

export default ({ _cacheMetadata, fallback, headers }: Params): Cacheability => {
  if (_cacheMetadata && !isEmpty(_cacheMetadata)) {
    const [first, ...rest] = Object.values(_cacheMetadata);

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
