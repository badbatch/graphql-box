import {
  type DehydratedCacheMetadata,
  type PlainObject,
  type RawResponseDataWithMaybeCacheMetadata,
} from '@graphql-box/core';

export interface RequestAndOptions {
  options: PlainObject;
  request: string;
}

export interface ParsedQuerySet {
  full: string;
  initial: string;
  updated: string;
}

export interface PartialQueryResponse {
  cacheMetadata: DehydratedCacheMetadata;
  data: PlainObject;
}

export interface QueryResponseSet {
  initial: RawResponseDataWithMaybeCacheMetadata;
  partial: PartialQueryResponse;
  updated: RawResponseDataWithMaybeCacheMetadata | RawResponseDataWithMaybeCacheMetadata[];
}

export interface Inbox {
  emails: Email[];
  id: number;
  total: number;
  unread: number;
}

export interface Email {
  from: string;
  id: number;
  message?: string;
  subject?: string;
  unread: boolean;
}

export interface EmailInput {
  from: string;
  message?: string;
  subject?: string;
}
