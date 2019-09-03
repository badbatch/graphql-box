import { CacheManagerDef, CacheManagerInit } from "@graphql-box/cache-manager";
import {
  DebugManagerDef,
  MaybeRequestResult,
  RequestContext,
  RequestManagerDef,
  RequestManagerInit,
  RequestOptions,
  SubscriptionsManagerDef,
  SubscriptionsManagerInit,
} from "@graphql-box/core";
import { DebugManagerInit } from "@graphql-box/debug-manager";
import { RequestParserDef, RequestParserInit } from "@graphql-box/request-parser";

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

export interface ConstructorOptions {
  /**
   * The cache manager.
   */
  cacheManager: CacheManagerDef;

  /**
   * The debug manager.
   */
  debugManager?: DebugManagerDef;

  /**
   * The request manager.
   */
  requestManager: RequestManagerDef;

  /**
   * The GraphQL request parser.
   */
  requestParser: RequestParserDef;

  /**
   * The subscriptions manager.
   */
  subscriptionsManager?: SubscriptionsManagerDef;
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
