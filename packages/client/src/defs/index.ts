import { CacheManagerDef } from "@graphql-box/cache-manager";
import {
  CacheMetadata,
  DebugManagerDef,
  PlainObjectMap,
  RequestContext,
  RequestData,
  RequestManagerDef,
  RequestOptions,
  RequestResult,
  SubscriptionsManagerDef,
} from "@graphql-box/core";
import { RequestParserDef } from "@graphql-box/request-parser";

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
   * Enable support for defer and stream directives.
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
   * The curried function to initialize the subscriptions manager.
   */
  subscriptionsManager?: SubscriptionsManagerDef;
}

export type PendingQueryResolver = (value: RequestResult) => void;

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
  filteredData: PlainObjectMap;
}
