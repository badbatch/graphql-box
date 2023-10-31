import { type CachemapOptions } from '@graphql-box/core';

export const transformCachemapOptions = (options?: CachemapOptions) => {
  if (!options) {
    return {};
  }

  const { cacheHeaders, tag } = options;

  const getHeaderValue = (key: 'cacheControl' | 'etag') => {
    if (cacheHeaders instanceof Headers) {
      return cacheHeaders.get(key);
    }

    return cacheHeaders[key];
  };

  return {
    cacheControl: getHeaderValue('cacheControl'),
    tag,
  };
};
