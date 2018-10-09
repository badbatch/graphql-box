import { coreDefs as cachemapDefs } from "@cachemap/core";
import { cacheDefs } from "@handl/cache-manager";
import { coreDefs } from "@handl/core";
import { debugDefs } from "@handl/debug-manager";
import { requestDefs } from "@handl/request-manager";
import { parserDefs } from "@handl/request-parser";
import { subDefs } from "@handl/subscriptions-manager";

/**
 * Constructor options.
 */
export interface ConstructorOptions {
  /**
   * The cache manager.
   */
  cacheManager?: cacheDefs.CacheManager;

  /**
   * The debug manager.
   */
  debugManager?: debugDefs.DebugManager;

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

  /**
   * The name of the property thats value is used as the unique
   * identifier for each type in the GraphQL schema.
   */
  typeIDKey: string;
}

/**
 * Init options.
 */
export interface InitOptions {
  /**
   * The curried function to initialize the cache manager.
   */
  cacheManager?: cacheDefs.CacheManagerInit;

  /**
   * The curried function to initialize the request manager.
   */
  requestManager: requestDefs.RequestManagerInit;

  /**
   * The curried function to initialize the debug manager.
   */
  debugManager?: debugDefs.DebugManagerInit;

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

export interface RequestResult {
  /**
   * A map of query paths to their cacheability
   * information.
   */
  _cacheMetadata?: cachemapDefs.Metadata;

  /**
   * The data requested in a query, mutation or subscription.
   */
  data?: coreDefs.PlainObjectMap;

  /**
   * Any errors thrown during the request.
   */
  errors?: Error | Error[];
}

export type PendingQueryResolver = (value: coreDefs.ResponseData) => void;

export interface PendingQueryData {
  context: coreDefs.RequestContext;
  options: coreDefs.RequestOptions;
  requestData: coreDefs.RequestData;
  resolve: PendingQueryResolver;
}

export interface QueryTracker {
  active: string[];
  pending: Map<string, PendingQueryData[]>;
}

export type SubscribeResult = AsyncIterator<any>;
