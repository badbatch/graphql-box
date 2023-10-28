import { type Core } from '@cachemap/core';
import { type Metadata } from '@cachemap/types';
import {
  type CacheMetadata,
  type CacheTypes,
  type DehydratedCacheMetadata,
  type FieldTypeInfo,
  type FragmentDefinitionNodeMap,
  type PlainData,
  type RawResponseDataWithMaybeCacheMetadata,
  type RequestContext,
  type RequestData,
  type RequestOptions,
  type ResponseData,
} from '@graphql-box/core';
import { type Cacheability } from 'cacheability';

export interface UserOptions {
  /**
   * The cache to use for storing query responses, data entities,
   * and request field paths.
   */
  cache: Core;
  /**
   * Whether to cascade cache control directives down to
   * child nodes if a child node does not have its down
   * cache control directives.
   */
  cascadeCacheControl?: boolean;
  /**
   * The cache control directive to apply to an operation
   * when none is provided in the response headers or the
   * operation's cache metadata.
   */
  fallbackOperationCacheability?: string;
  /**
   * An object map of GraphQL schema types to cache-control
   * directives used for caching object types.
   */
  typeCacheDirectives?: Record<string, string>;
  /**
   * The name of the property thats value is used as the unique
   * identifier for each type in the GraphQL schema.
   */
  typeIDKey?: string;
}

export interface CacheManagerContext extends RequestContext {
  fragmentDefinitions?: FragmentDefinitionNodeMap;
  typeIDKey?: string;
}

export interface PartialQueryResponse {
  cacheMetadata: CacheMetadata;
  data: PlainData;
}

export type PartialQueryResponses = Map<string, PartialQueryResponse>;

export interface FieldCount {
  missing: number;
  total: number;
}

export interface FieldPathChecklistValue {
  fragmentKind: string | undefined;
  fragmentName: string | undefined;
  hasData: boolean;
  typeName?: string | undefined;
}

export interface CheckFieldPathChecklistResult {
  hasData: boolean;
  typeUnused?: boolean;
}

export type FieldPathChecklist = Map<string, FieldPathChecklistValue[]>;

export interface CachedResponseData {
  cacheMetadata: CacheMetadata;
  data: PlainData;
  fieldCount: FieldCount;
  fieldPathChecklist: FieldPathChecklist;
}

export interface AncestorKeysAndPaths {
  index?: number;
  requestFieldCacheKey?: string;
  requestFieldPath?: string;
  responseDataPath?: string;
}

export interface MergedCachedFieldData {
  cacheability?: Cacheability;
  data: unknown;
}

export interface CachedAncestorFieldData {
  cacheability?: Cacheability;
  entityData?: unknown;
  fragmentKind?: string;
  fragmentName?: string;
  index?: number;
  requestFieldCacheKey?: string;
  requestFieldPath?: string;
  requestFieldPathData?: unknown;
  typeName?: string;
}

export interface TypenamesAndKind {
  dataTypename: string | undefined;
  fieldTypename: string | undefined;
  fragmentKind: string | undefined;
  fragmentName: string | undefined;
}

export type FragmentSpreadFieldCounter = Record<string, { hasData: number; total: number }>;

export interface ResponseDataForCaching {
  cacheMetadata: CacheMetadata;
  entityData: PlainData;
  requestFieldPathData: PlainData;
}

export interface DataForCachingEntry {
  cacheability: Cacheability;
  data: PlainData;
  fieldTypeInfo: FieldTypeInfo;
}

export interface ExportCacheResult {
  entries: [string, unknown][];
  metadata: Metadata[];
}

export interface AnalyzeQueryResult {
  response?: ResponseData;
  updated?: RequestData;
}

export interface CheckCacheEntryResult<T = unknown> {
  cacheability: Cacheability;
  entry: T;
}

export interface QueryResponseCacheEntry {
  cacheMetadata: DehydratedCacheMetadata;
  data: PlainData;
}

export interface CacheManagerDef {
  analyzeQuery(requestData: RequestData, options: RequestOptions, context: RequestContext): Promise<AnalyzeQueryResult>;
  cache: Core;
  cacheQuery(
    requestData: RequestData,
    updatedRequestData: RequestData | undefined,
    responseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext
  ): Promise<ResponseData>;
  cacheResponse(
    requestData: RequestData,
    responseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext
  ): Promise<ResponseData>;
  checkCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    options: RequestOptions,
    context: RequestContext
  ): Promise<CheckCacheEntryResult | false>;
  checkQueryResponseCacheEntry(
    hash: string,
    options: RequestOptions,
    context: RequestContext
  ): Promise<ResponseData | false>;
  deletePartialQueryResponse(hash: string): void;
  setQueryResponseCacheEntry(
    requestData: RequestData,
    responseData: ResponseData,
    options: RequestOptions,
    context: CacheManagerContext
  ): Promise<void>;
}
