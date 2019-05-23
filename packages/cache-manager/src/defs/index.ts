import Cachemap, { coreDefs as cachemapDefs } from "@cachemap/core";
import {
  CacheMetadata,
  CacheTypes,
  DehydratedCacheMetadata,
  FieldTypeInfo,
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
}

export interface ClientOptions {
  typeIDKey: string;
}

export interface InitOptions {
  cache: Cachemap;
  cascadeCacheControl?: boolean;
  fallbackOperationCacheability?: string;
  typeCacheDirectives?: PlainObjectStringMap;
  typeIDKey: string;
}

export interface ConstructorOptions {
  cache: Cachemap;
  cascadeCacheControl?: boolean;
  fallbackOperationCacheability?: string;
  typeCacheDirectives?: PlainObjectStringMap;
  typeIDKey: string;
}

export interface PartialQueryResponse {
  data: PlainObjectMap;
  cacheMetadata: CacheMetadata;
}

export type PartialQueryResponses = Map<string, PartialQueryResponse>;

export interface FieldCount {
  missing: number;
  total: number;
}

export interface FieldPathChecklistValue {
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

export interface CachedFieldData {
  cacheability?: Cacheability;
  dataEntityData?: any;
  requestFieldPathData?: any;
}

export interface MergedCachedFieldData {
  cacheability?: Cacheability;
  data: any;
}

export interface CachedAncestorFieldData {
  cacheability?: Cacheability;
  dataEntityData?: any;
  requestFieldPathData?: any;
  requestFieldCacheKey?: string;
  requestFieldPath?: string;
  index?: number;
  typeName?: string;
}

export interface KeysAndPathsOptions {
  index?: number;
  requestFieldCacheKey?: string;
  requestFieldPath?: string;
  responseDataPath?: string;
}

export interface KeysAndPaths {
  hashedRequestFieldCacheKey: string;
  propNameOrIndex: string | number;
  requestFieldCacheKey: string;
  requestFieldPath: string;
  responseDataPath: string;
}

export interface TypeNames {
  dataTypeName: string | undefined;
  fieldTypeName: string | undefined;
}

export interface ResponseDataForCaching {
  cacheMetadata: CacheMetadata;
  dataEntityData: PlainObjectMap;
  requestFieldPathData: PlainObjectMap;
}

export interface DataForCachingEntry {
  cacheability: Cacheability;
  data: PlainObjectMap;
  fieldTypeInfo: FieldTypeInfo;
}

export interface ExportCacheResult {
  entries: Array<[string, any]>;
  metadata: cachemapDefs.Metadata[];
}

export interface AnalyzeQueryResult {
  response?: ResponseData;
  updated?: RequestData;
}

export interface CheckCacheEntryResult {
  cacheability: Cacheability;
  entry: PlainObjectMap | any[];
}

export interface QueryResponseCacheEntry {
  cacheMetadata: DehydratedCacheMetadata;
  data: PlainObjectMap;
}

export interface CachemapOptions {
  cacheHeaders: cachemapDefs.CacheHeaders;
  tag?: any;
}

export interface CacheManagerDef {
  cache: Cachemap;
  analyzeQuery(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<AnalyzeQueryResult>;
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
  deletePartialQueryResponse(
    hash: string,
  ): void;
  resolveQuery(
    requestData: RequestData,
    updatedRequestData: RequestData,
    responseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData>;
  resolveRequest(
    requestData: RequestData,
    responseData: RawResponseDataWithMaybeCacheMetadata,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<ResponseData>;
}

export type CacheManagerInit = (options: ClientOptions) => Promise<CacheManagerDef>;
