import { IncrementalRequestManagerResult, PlainObjectMap, RequestManagerResult } from "@graphql-box/core";
import { set } from "lodash";
import cleanIncrementalResult from "./cleanIncrementalResult";

export default (result: IncrementalRequestManagerResult): RequestManagerResult => {
  if ("data" in result) {
    const { _cacheMetadata, data, extensions, headers } = result;
    return { _cacheMetadata, data, extensions, headers };
  }

  const { _cacheMetadata, extensions, headers, incremental } = result;

  const mergedData =
    incremental?.reduce((acc: PlainObjectMap, entry) => {
      if (entry.path) {
        if ("data" in entry && entry.data) {
          set(acc, entry.path, cleanIncrementalResult(entry.data));
        } else if ("items" in entry && entry.items?.[0]) {
          set(acc, entry.path, cleanIncrementalResult(entry.items[0]));
        }
      }

      return acc;
    }, {}) ?? {};

  return {
    _cacheMetadata,
    data: mergedData,
    extensions,
    headers,
  };
};
