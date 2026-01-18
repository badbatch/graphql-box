import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type OperationContext,
  type OperationData,
  type PlainObject,
  type ResponseData,
} from '@graphql-box/core';
import { type Metadata as CacheabilityMetadata } from 'cacheability';

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
  extensions: Record<string, unknown> & { cacheability: CacheabilityMetadata };
  kind: 'entity';
  refTargets: Record<string, string[]>;
  value: T;
};

export type OperationPathCacheEntry<T = unknown> = {
  extensions: Record<string, unknown> & { cacheability: CacheabilityMetadata };
  kind: 'operationPath';
  refTargets: Record<string, string[]>;
  value: T;
};

export type OperationCacheEntry = {
  extensions: Record<string, unknown> & { cacheability: CacheabilityMetadata };
  kind: 'operation';
  refTargets: Record<string, string[]>;
  refs: string[];
};

export type CacheEntry<T = unknown> = EntityCacheEntry<T> | OperationPathCacheEntry<T> | OperationCacheEntry;

export type RetrieveCacheEntryResult<D = unknown> =
  | {
      extensions: { cacheMetadata: CacheMetadata };
      kind: 'hit';
      value: D;
    }
  | {
      kind: 'miss';
    };
