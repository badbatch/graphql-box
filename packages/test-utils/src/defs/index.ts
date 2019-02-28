import { PlainObjectMap, RawResponseDataWithMaybeCacheMetadata } from "@handl/core";

export interface RequestAndOptions {
  options: PlainObjectMap;
  request: string;
}

export interface ParsedQueryWithFilter {
  full: string;
  initial: string;
  updated: string;
}

export interface QueryResponsePartialAndFilter {
  initial: RawResponseDataWithMaybeCacheMetadata;
  partial: RawResponseDataWithMaybeCacheMetadata;
  updated: RawResponseDataWithMaybeCacheMetadata;
}
