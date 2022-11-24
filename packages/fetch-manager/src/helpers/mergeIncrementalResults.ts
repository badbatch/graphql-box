import { IncrementalFetchResult } from "@graphql-box/core";

export default (incrementalResults: IncrementalFetchResult[]) => {
  return incrementalResults.reduce((acc: IncrementalFetchResult, result, index) => {
    if (!acc) {
      return result;
    }

    const { _cacheMetadata, hasNext, incremental } = result;

    if (_cacheMetadata) {
      acc._cacheMetadata = acc._cacheMetadata ? { ...acc._cacheMetadata, ..._cacheMetadata } : _cacheMetadata;
    }

    if (incremental) {
      acc.incremental = acc.incremental ? [...acc.incremental, ...incremental] : incremental;
    }

    if (index === incrementalResults.length - 1) {
      acc.hasNext = hasNext;
    }

    return acc;
  });
};
