import { type CacheManagerDef } from '@graphql-box/cache-manager';
import {
  type DebugManagerDef,
  type OperationParams,
  type RequestManagerDef,
  type ResponseData,
  type SubscriptionsManagerDef,
} from '@graphql-box/core';
import { type OperationParserDef } from '@graphql-box/operation-parser';

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
   * The curried function to initialzie the request parser.
   */
  operationParser: OperationParserDef;
  /**
   * The request manager.
   */
  requestManager: RequestManagerDef;
  /**
   * The curried function to initialize the subscription manager.
   */
  subscriptionsManager?: SubscriptionsManagerDef;
}

export type PendingQueryParams = OperationParams & { resolver: PendingQueryResolver };

export type PendingQueryResolver = (value: ResponseData) => void;

export type QueryTracker = {
  active: OperationParams[];
  pending: Record<string, PendingQueryParams[]>;
};
