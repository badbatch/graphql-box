import { RawResponseDataWithMaybeCacheMetadata } from "@graphql-box/core";
import { CacheManagerContext } from "..";

export default (rawResponseData: RawResponseDataWithMaybeCacheMetadata, context: CacheManagerContext) =>
  context.hasDeferOrStream && rawResponseData.hasNext && !rawResponseData.paths;
