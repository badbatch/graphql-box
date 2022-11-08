import Cachemap from "@cachemap/core";
import { Metadata } from "@cachemap/types";
import {
  CacheMetadata,
  CacheTypes,
  DehydratedCacheMetadata,
  FieldTypeInfo,
  FragmentDefinitionNodeMap,
  PlainObjectMap,
  PlainObjectStringMap,
  RawResponseDataWithMaybeCacheMetadata,
  RequestContext,
  RequestData,
  RequestOptions,
  ResponseData,
} from "@graphql-box/core";
import Cacheability from "cacheability";

export interface UserOptions {
  /**
   * The cache to use for storing query responses, data entities,
   * and request field paths.
   */
  cache: Cachemap;

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
  typeCacheDirectives?: PlainObjectStringMap;

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
  data: PlainObjectMap;
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
  data: PlainObjectMap;
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
  data: any;
}

export interface CachedAncestorFieldData {
  cacheability?: Cacheability;
  entityData?: any;
  fragmentKind?: string;
  fragmentName?: string;
  index?: number;
  requestFieldCacheKey?: string;
  requestFieldPath?: string;
  requestFieldPathData?: any;
  typeName?: string;
}

export interface TypeNamesAndKind {
  dataTypeName: string | undefined;
  fieldTypeName: string | undefined;
  fragmentKind: string | undefined;
  fragmentName: string | undefined;
}

export type FragmentSpreadFieldCounter = Record<string, { hasData: number; total: number }>;

export interface ResponseDataForCaching {
  cacheMetadata: CacheMetadata;
  entityData: PlainObjectMap;
  requestFieldPathData: PlainObjectMap;
}

export interface DataForCachingEntry {
  cacheability: Cacheability;
  data: PlainObjectMap;
  fieldTypeInfo: FieldTypeInfo;
}

export interface ExportCacheResult {
  entries: [string, any][];
  metadata: Metadata[];
}

export interface AnalyzeQueryResult {
  response?: ResponseData;
  updated?: RequestData;
}

export interface CheckCacheEntryResult {
  cacheability: Cacheability;
  entry: any;
}

export interface QueryResponseCacheEntry {
  cacheMetadata: DehydratedCacheMetadata;
  data: PlainObjectMap;
}

export interface CacheManagerDef {
  cache: Cachemap;
  analyzeQuery(requestData: RequestData, options: RequestOptions, context: RequestContext): Promise<AnalyzeQueryResult>;
  cacheQuery(
    requestData: RequestData,
    updatedRequestData: RequestData | undefined,
    responseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData>;
  cacheResponse(
    requestData: RequestData,
    responseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData>;
  checkCacheEntry(
    cacheType: CacheTypes,
    hash: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<CheckCacheEntryResult | false>;
  checkQueryResponseCacheEntry(
    hash: string,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData | false>;
  deletePartialQueryResponse(hash: string): void;
  setQueryResponseCacheEntry(
    requestData: RequestData,
    responseData: ResponseData,
    options: RequestOptions,
    context: CacheManagerContext,
  ): Promise<void>;
}
