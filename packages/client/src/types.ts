import { type CacheManagerDef } from '@graphql-box/cache-manager';
import {
  type DebugManagerDef,
  type RequestContext,
  type RequestData,
  type RequestManagerDef,
  type RequestOptions,
  type SubscriptionsManagerDef,
} from '@graphql-box/core';
import { type RequestParserDef } from '../../operation-parser';

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
export interface ActiveQueryData {
  context: RequestContext;
  options: RequestOptions;
  requestData: RequestData;
}

export interface QueryTracker {
  activeQueries: ActiveQueryData[];
}
