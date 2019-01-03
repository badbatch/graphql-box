import { cacheDefs } from "@handl/cache-manager";
import { coreDefs } from "@handl/core";
import { debugDefs } from "@handl/debug-manager";
import { requestDefs } from "@handl/request-manager";
import { parserDefs } from "@handl/request-parser";
import { subDefs } from "@handl/subscriptions-manager";

export interface ConstructorOptions {
  /**
   * The cache manager.
   */
  cacheManager?: cacheDefs.CacheManager;

  /**
   * The request manager.
   */
  requestManager: requestDefs.RequestManager;

  /**
   * The GraphQL request parser.
   */
  requestParser?: parserDefs.RequestParser;

  /**
   * The subscriptions manager.
   */
  subscriptionsManager?: subDefs.SubscriptionsManager;
}

export interface UserOptions {
  /**
   * The curried function to initialize the cache manager.
   */
  cacheManager?: cacheDefs.CacheManagerInit;

  /**
   * The curried function to initialize the request manager.
   */
  requestManager: requestDefs.RequestManagerInit;

  /**
   * The debug manager.
   */
  debugManager?: debugDefs.DebugManager;

  /**
   * The curried function to initialzie the request parser.
   */
  requestParser?: parserDefs.RequestParserInit;

  /**
   * The curried function to initialize the subscriptions manager.
   */
  subscriptionsManager?: subDefs.SubscriptionsManagerInit;

  /**
   * The name of the property thats value is used as the unique
   * identifier for each type in the GraphQL schema.
   */
  typeIDKey?: string;
}

export type PendingQueryResolver = (value: coreDefs.MaybeRequestResult) => void;

export interface PendingQueryData {
  context: coreDefs.RequestContext;
  options: coreDefs.RequestOptions;
  resolve: PendingQueryResolver;
}

export interface QueryTracker {
  active: string[];
  pending: Map<string, PendingQueryData[]>;
}
