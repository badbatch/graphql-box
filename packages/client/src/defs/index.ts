import { CacheManagerInit } from "@graphql-box/cache-manager";
import {
  CacheMetadata,
  DebugManagerDef,
  MaybeRequestResult,
  PlainObjectMap,
  RequestContext,
  RequestData,
  RequestManagerDef,
  RequestOptions,
  SubscriptionsManagerInit,
} from "@graphql-box/core";
import { RequestParserInit } from "@graphql-box/request-parser";

export interface UserOptions {
  /**
   * The curried function to initialize the cache manager.
   */
  cacheManager: CacheManagerInit;

  /**
   * The curried function to initialize the debug manager.
   */
  debugManager?: DebugManagerDef;

  /**
   * The request manager.
   */
  requestManager: RequestManagerDef;

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
