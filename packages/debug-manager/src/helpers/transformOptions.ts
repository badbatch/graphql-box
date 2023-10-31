import { type PlainObject, type RequestOptions, type ServerRequestOptions } from '@graphql-box/core';

const isServerRequestOptions = (options: RequestOptions | ServerRequestOptions): options is ServerRequestOptions =>
  'contextValue' in options;

export type TransformedOptions = {
  awaitDataCaching?: boolean;
  batch?: boolean;
  contextValue?: PlainObject;
  returnCacheMetadata?: boolean;
  tag?: string | number;
  variables?: PlainObject;
};

export const transformOptions = (options?: RequestOptions | ServerRequestOptions): TransformedOptions => {
  if (!options) {
    return {};
  }

  let transformedOptions: TransformedOptions = {};

  if (isServerRequestOptions(options)) {
    const { awaitDataCaching, returnCacheMetadata, tag } = options;

    transformedOptions = {
      awaitDataCaching,
      returnCacheMetadata,
      tag,
    };
  } else {
    const { awaitDataCaching, batch, returnCacheMetadata, tag, variables } = options;

    transformedOptions = {
      awaitDataCaching,
      batch,
      returnCacheMetadata,
      tag,
      variables,
    };
  }

  return transformedOptions;
};
