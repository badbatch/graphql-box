import { PlainObjectMap, RequestOptions, ServerRequestOptions } from "@graphql-box/core";

const isServerRequestOptions = (options: RequestOptions | ServerRequestOptions): options is ServerRequestOptions =>
  "contextValue" in options;

export type TransformedOptions = {
  awaitDataCaching?: boolean;
  batch?: boolean;
  contextValue?: PlainObjectMap;
  returnCacheMetadata?: boolean;
  tag?: any;
  variables?: PlainObjectMap;
};

export default (options?: RequestOptions | ServerRequestOptions): TransformedOptions => {
  if (!options) {
    return {};
  }

  let transformedOptions: TransformedOptions = {};

  if (isServerRequestOptions(options)) {
    const { awaitDataCaching, returnCacheMetadata, tag } = options;

    transformedOptions = {
      ...transformedOptions,
      awaitDataCaching,
      returnCacheMetadata,
      tag,
    };
  } else {
    const { awaitDataCaching, batch, returnCacheMetadata, tag, variables } = options;

    transformedOptions = {
      ...transformedOptions,
      awaitDataCaching,
      batch,
      returnCacheMetadata,
      tag,
      variables,
    };
  }

  return transformedOptions;
};
