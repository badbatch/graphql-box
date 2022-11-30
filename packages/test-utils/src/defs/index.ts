import {
  CacheResult,
  IncrementalRequestManagerResult,
  PlainObjectMap,
  RequestManagerResult,
  SubscriptionsManagerResult,
} from "@graphql-box/core";

export interface RequestAndOptions {
  options: PlainObjectMap;
  request: string;
}

export interface ParsedRequestSet {
  full: string;
  initial: string;
  updated: string;
}

export type MockRequestManagerResult = Omit<RequestManagerResult, "_cacheMetadata"> & {
  _cacheMetadata: Record<string, string>;
};

export type MockSubscriptionsManagerResult = Omit<SubscriptionsManagerResult, "_cacheMetadata"> & {
  _cacheMetadata: Record<string, string>;
};

export type MockCacheResult = Omit<CacheResult, "_cacheMetadata"> & {
  _cacheMetadata: Record<string, string>;
};

export type MockIncrementalRequestManagerResult = Omit<IncrementalRequestManagerResult, "_cacheMetadata"> & {
  _cacheMetadata: Record<string, string>;
};

export interface MockRequestManagerResultSet {
  initial: MockRequestManagerResult;
  partial: MockCacheResult;
  updated: MockRequestManagerResult;
}

export type MockIncrementalRequestManagerResultSet = {
  initial: MockRequestManagerResult;
  partial: MockCacheResult;
  updated: MockIncrementalRequestManagerResult[];
};

/************************************************************************ */

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
