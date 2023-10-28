import { type DehydratedCacheMetadata } from '@graphql-box/core';
import { Cacheability } from 'cacheability';
import { isEmpty } from 'lodash-es';
import { HEADER_CACHE_CONTROL } from '../constants.ts';

export type Params = {
  _cacheMetadata?: DehydratedCacheMetadata;
  fallback: string;
  headers?: Headers;
};

export const deriveOpCacheability = ({ _cacheMetadata, fallback, headers }: Params): Cacheability => {
  if (_cacheMetadata && !isEmpty(_cacheMetadata)) {
    const [first, ...rest] = Object.values(_cacheMetadata);

    return new Cacheability({
      metadata: rest.reduce((acc, metadata) => {
        if (!acc) {
          return metadata;
        }

        if (metadata.ttl < acc.ttl) {
          return metadata;
        }

        return acc;
      }, first),
    });
  }

  if (headers?.has(HEADER_CACHE_CONTROL)) {
    return new Cacheability({ headers });
  }

  return new Cacheability({ cacheControl: fallback });
};
