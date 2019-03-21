import { DehydratedCacheMetadata, PlainObjectMap, RawResponseDataWithMaybeCacheMetadata } from "@handl/core";

export interface RequestAndOptions {
  options: PlainObjectMap;
  request: string;
}

export interface ParsedQuerySet {
  full: string;
  initial: string;
  updated: string;
}

export interface PartialQueryResponse {
  cacheMetadata: DehydratedCacheMetadata;
  data: PlainObjectMap;
}

export interface QueryResponseSet {
  initial: RawResponseDataWithMaybeCacheMetadata;
  partial: PartialQueryResponse;
  updated: RawResponseDataWithMaybeCacheMetadata;
}
