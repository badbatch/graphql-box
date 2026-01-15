import { type Core } from '@cachemap/core';
import { type FieldPaths, type OperationContext, type OperationData, type ResponseData } from '@graphql-box/core';

export interface UserOptions {
  /**
   * The cache instance.
   */
  cache: Core | (() => Promise<Core>);
  /**
   * The fallback cache control directives to apply when
   * there is no cache metadata for an operation path.
   */
  fallbackCacheControlDirectives?: string;
  /**
   * Whether to hash operations and field paths used as
   * cache keys.
   */
  hashCacheKeys?: boolean;
}

export type AnalyzeQueryResult =
  | {
      kind: 'cache-hit';
      responseData: ResponseData;
    }
  | {
      kind: 'cache-miss';
      operationData: OperationData;
    }
  | {
      kind: 'partial';
      operationData: OperationData;
      resolvedFieldPaths: FieldPaths;
    };

export interface CacheManagerDef {
  analyzeQuery(requestData: OperationData, context: OperationContext): Promise<AnalyzeQueryResult>;
  cache: Core | undefined;
  cacheQuery(operationData: OperationData, responseData: ResponseData, context: OperationContext): Promise<void>;
  hashCacheKeys: boolean;
}

export type EntityCacheEntry<T = unknown> = {
  kind: 'entity';
  value: T;
};

export type OperationPathCacheEntry<T = unknown> = {
  kind: 'operationPath';
  value: T;
};

export type OperationCacheEntry = {
  kind: 'operation';
  refs: string[];
};

export type CacheEntry<T = unknown> = EntityCacheEntry<T> | OperationPathCacheEntry<T> | OperationCacheEntry;
