import { CacheManagerInit } from "@graphql-box/cache-manager";
import {
  CacheMetadata,
  MaybeRequestResult,
  PlainObjectMap,
  RequestContext,
  RequestData,
  RequestManagerInit,
  RequestOptions,
  SubscriptionsManagerInit,
} from "@graphql-box/core";
import { DebugManagerInit } from "@graphql-box/debug-manager";
import { RequestParserInit } from "@graphql-box/request-parser";

export interface UserOptions {
  /**
   * The curried function to initialize the cache manager.
   */
  cacheManager: CacheManagerInit;

  /**
   * The curried function to initialize the debug manager.
   */
  debugManager?: DebugManagerInit;

  /**
   * The curried function to initialize the request manager.
   */
  requestManager: RequestManagerInit;

  /**
   * The curried function to initialzie the request parser.
   */
  requestParser: RequestParserInit;

  /**
   * The curried function to initialize the subscriptions manager.
   */
  subscriptionsManager?: SubscriptionsManagerInit;

  /**
   * The name of the property thats value is used as the unique
   * identifier for each type in the GraphQL schema.
   */
  typeIDKey?: string;
}

export type PendingQueryResolver = (value: MaybeRequestResult) => void;

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
