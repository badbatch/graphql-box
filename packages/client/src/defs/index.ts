import { CacheManagerDef, CacheManagerInit } from "@handl/cache-manager";
import { MaybeRequestResult, RequestContext, RequestOptions } from "@handl/core";
import { DebugManagerDef } from "@handl/debug-manager";
import { RequestManagerDef, RequestManagerInit } from "@handl/request-manager";
import { RequestParserDef, RequestParserInit } from "@handl/request-parser";
import { SubscriptionsManagerDef, SubscriptionsManagerInit } from "@handl/subscriptions-manager";

export interface ConstructorOptions {
  /**
   * The cache manager.
   */
  cacheManager?: CacheManagerDef;

  /**
   * The request manager.
   */
  requestManager: RequestManagerDef;

  /**
   * The GraphQL request parser.
   */
  requestParser?: RequestParserDef;

  /**
   * The subscriptions manager.
   */
  subscriptionsManager?: SubscriptionsManagerDef;
}

export interface UserOptions {
  /**
   * The curried function to initialize the cache manager.
   */
  cacheManager?: CacheManagerInit;

  /**
   * The curried function to initialize the request manager.
   */
  requestManager: RequestManagerInit;

  /**
   * The debug manager.
   */
  debugManager?: DebugManagerDef;

  /**
   * The curried function to initialzie the request parser.
   */
  requestParser?: RequestParserInit;

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
  resolve: PendingQueryResolver;
}

export interface QueryTracker {
  active: string[];
  pending: Map<string, PendingQueryData[]>;
}
