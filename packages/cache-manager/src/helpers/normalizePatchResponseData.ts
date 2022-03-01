import { RawResponseDataWithMaybeCacheMetadata } from "@graphql-box/core";
import { set } from "lodash";
import { CacheManagerContext } from "..";

export default (rawResponseData: RawResponseDataWithMaybeCacheMetadata, context: CacheManagerContext) => {
  if (!context.normalizePatchResponseData) {
    return rawResponseData;
  }

  const { data, paths, ...rest } = rawResponseData;

  return {
    ...rest,
    data: set({}, (paths as string[])[0], data),
    paths,
  };
};
