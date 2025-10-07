import { type Core } from '@cachemap/core';
import { type OperationContext, type OperationData, type ResponseData } from '@graphql-box/core';
import { type RequireAtLeastOne } from 'type-fest';

export interface UserOptions {
  /**
   * The cache instance.
   */
  cache: Core | (() => Promise<Core>);
  /**
   * Whether to hash operations and field paths used as
   * cache keys.
   */
  hashCacheKeys?: boolean;
}

export type AnalyzeQueryResult = RequireAtLeastOne<{
  operationData?: OperationData;
  responseData?: ResponseData;
}>;

export interface CacheManagerDef {
  analyzeQuery(requestData: OperationData, context: OperationContext): Promise<AnalyzeQueryResult>;
  cache: Core | undefined;
  cacheQuery(responseData: ResponseData, context: OperationContext): Promise<void>;
  hashCacheKeys: boolean;
}
