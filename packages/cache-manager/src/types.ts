import { type Core } from '@cachemap/core';
import {
  type CacheMetadata,
  type Entity,
  type FieldPathMetadata,
  type FieldPathMetadataRequiredFields,
  type OperationContext,
  type OperationData,
  type ResponseData,
} from '@graphql-box/core';
import { type Metadata as CacheabilityMetadata } from 'cacheability';

export interface UserOptions {
  /**
   * The cache instance.
   */
  cache: Core | (() => Promise<Core>);
  /**
   * Enables additional logging to aid in debugging.
   */
  debug?: boolean;
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
  analyzeQuery(requestData: OperationData, context: OperationContext): AnalyzeQueryResult;
  cache: Core | undefined;
  cacheQuery(operationData: OperationData, responseData: ResponseData, context: OperationContext): void;
  hashCacheKeys: boolean;
}

export interface CacheEntryRef {
  __ref: string;
}

export type CacheOptions = { tag?: string | number };

export type EntityRequiredFields = FieldPathMetadataRequiredFields;

export type EntityCacheEntry<T = Entity> = {
  extensions: Record<string, unknown> & { cacheability: CacheabilityMetadata };
  kind: 'entity';
  refTargets: RefTargets;
  value: T;
};

export type OperationPathCacheEntry<T = unknown> = {
  extensions: Record<string, unknown> & { cacheability: CacheabilityMetadata; fieldPathMetadata: FieldPathMetadata };
  kind: 'operationPath';
  refTargets: RefTargets;
  value: T;
};

export type OperationCacheEntry = {
  extensions: Record<string, unknown> & { cacheMetadata: CacheMetadata };
  kind: 'operation';
  refTargets: RefTargets;
};

export type CacheEntry<T = unknown> = EntityCacheEntry<T> | OperationPathCacheEntry<T> | OperationCacheEntry;

export type RefTargets = Record<string, string[]>;

export type RetrieveCacheEntryResult<D = unknown> =
  | {
      extensions: { cacheMetadata: CacheMetadata };
      kind: 'hit';
      value: D;
    }
  | {
      kind: 'miss';
    };
