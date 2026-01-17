import { type Core } from '@cachemap/core';
import { type OperationContext, type OperationData, type PlainObject, type ResponseData } from '@graphql-box/core';

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
      resolvedFieldPaths: string[];
    };

export interface CacheManagerDef {
  analyzeQuery(requestData: OperationData, context: OperationContext): Promise<AnalyzeQueryResult>;
  cache: Core | undefined;
  cacheQuery(operationData: OperationData, responseData: ResponseData, context: OperationContext): Promise<void>;
  hashCacheKeys: boolean;
}

export type CacheEntryRef = {
  __ref: string;
};

export type EntityCacheEntry<T = PlainObject<unknown>> = {
  kind: 'entity';
  refTargets: Record<string, string[]>;
  value: T;
};

export type OperationPathCacheEntry<T = unknown> = {
  kind: 'operationPath';
  refTargets: Record<string, string[]>;
  value: T;
};

export type OperationCacheEntry = {
  kind: 'operation';
  refTargets: Record<string, string[]>;
  refs: string[];
};

export type CacheEntry<T = unknown> = EntityCacheEntry<T> | OperationPathCacheEntry<T> | OperationCacheEntry;

export type RetrieveCacheEntryResult<D = unknown> =
  | {
      kind: 'hit';
      value: D;
    }
  | {
      kind: 'miss';
    };
