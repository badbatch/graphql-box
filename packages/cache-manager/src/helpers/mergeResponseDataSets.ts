import { RawResponseDataWithMaybeCacheMetadata } from "@graphql-box/core";
import { merge } from "lodash";

export default (responseDataSets: RawResponseDataWithMaybeCacheMetadata[]) => {
  return responseDataSets.reduce(
    (acc: RawResponseDataWithMaybeCacheMetadata, dataSet, index) => {
      const { _cacheMetadata, data, hasNext, headers, paths } = dataSet;

      if (_cacheMetadata) {
        acc._cacheMetadata = acc._cacheMetadata ? { ...acc._cacheMetadata, ..._cacheMetadata } : _cacheMetadata;
      }

      acc.data = acc.data ? merge(acc.data, data) : data;

      if (index === 0) {
        acc.headers = headers;
      }

      if (index === responseDataSets.length - 1) {
        acc.hasNext = hasNext;
      }

      if (paths) {
        if (!acc.paths) {
          acc.paths = [];
        }

        acc.paths.push(paths[0]);
      }

      return acc;
    },
    { data: {} },
  );
};
