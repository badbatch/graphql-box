import { type CacheManagerDef } from '@graphql-box/cache-manager';
import {
  type CacheMetadata,
  type DebugManagerDef,
  type PartialRequestResult,
  type PlainObject,
  type RequestContext,
  type RequestData,
  type RequestManagerDef,
  type RequestOptions,
  type SubscriptionsManagerDef,
} from '@graphql-box/core';
import { type RequestParserDef } from '@graphql-box/request-parser';

export interface UserOptions {
  /**
   * The curried function to initialize the cache manager.
   */
  cacheManager: CacheManagerDef;
  /**
   * The curried function to initialize the debug manager.
   */
  debugManager?: DebugManagerDef;
  /**
   * Enable support for defer and stream directives. Based on version
   * of spec in 16.1.0-experimental-stream-defer.6
   */
  experimentalDeferStreamSupport?: boolean;
  /**
   * The request manager.
   */
  requestManager: RequestManagerDef;
  /**
   * The curried function to initialzie the request parser.
   */
  requestParser: RequestParserDef;
  /**
   * The curried function to initialize the subscription manager.
   */
  subscriptionsManager?: SubscriptionsManagerDef;
}

export type PendingQueryResolver = (value: PartialRequestResult) => void;

export interface PendingQueryData {
  context: RequestContext;
  options: RequestOptions;
  requestData: RequestData;
  resolve: PendingQueryResolver;
}

export interface ActiveQueryData {
  context: RequestContext;
  options: RequestOptions;
  requestData: RequestData;
}

export interface QueryTracker {
  active: ActiveQueryData[];
  pending: Map<string, PendingQueryData[]>;
}

export interface FilteredDataAndCacheMetadata {
  filteredCacheMetadata: CacheMetadata;
  filteredData: PlainObject;
}
