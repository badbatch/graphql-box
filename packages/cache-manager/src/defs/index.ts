import Cachemap, { coreDefs as cachemapDefs } from "@cachemap/core";
import { coreDefs } from "@handl/core";
import { debugDefs } from "@handl/debug-manager";
import Cacheability, { Metadata as CacheabilityMetadata } from "cacheability";

export interface UserOptions {
  /**
   * The cache to use for storing query responses, data entities,
   * and request field paths.
   */
  cache: Cachemap;

  /**
   * The debug manager.
   */
  debugManager?: debugDefs.DebugManager;

  /**
   * An object map of GraphQL schema types to cache-control
   * directives used for caching object types.
   */
  typeCacheDirectives?: coreDefs.PlainObjectStringMap;
}

export interface ClientOptions {
  typeIDKey: string;
}

export interface InitOptions {
  cache: Cachemap;
  debugManager?: debugDefs.DebugManager;
  typeCacheDirectives?: coreDefs.PlainObjectStringMap;
  typeIDKey: string;
}

export interface ConstructorOptions {
  cache: Cachemap;
  typeCacheDirectives?: coreDefs.PlainObjectStringMap;
  typeIDKey: string;
}

export type CacheMetadata = Map<string, Cacheability>;

export interface DehydratedCacheMetadata {
  [key: string]: CacheabilityMetadata;
}

export interface PartialQueryResponse {
  data: coreDefs.PlainObjectMap;
  cacheMetadata: CacheMetadata;
}

export interface FieldCount {
  missing: number;
  total: number;
}

export type FieldPathChecklist = Map<string, boolean>;

export interface CachedResponseData {
  cacheMetadata: CacheMetadata;
  data: coreDefs.PlainObjectMap;
  fieldCount: FieldCount;
  fieldPathChecklist: FieldPathChecklist;
}

export interface CachedFieldData {
  cacheability?: Cacheability;
  dataEntityData?: any;
  requestFieldPathData?: any;
  requestFieldCacheKey?: string;
  requestFieldPath?: string;
  index?: number;
}

export interface KeysAndPathsOptions {
  index?: number;
  requestFieldCacheKey?: string;
  requestFieldPath?: string;
  responseDataPath?: string;
}

export interface KeysAndPaths {
  hashedRequestFieldCacheKey: string;
  name: string;
  propNameOrIndex: string | number;
  requestFieldCacheKey: string;
  requestFieldPath: string;
  responseDataPath: string;
}

export interface ExportCacheResult {
  entries: Array<[string, any]>;
  metadata: cachemapDefs.Metadata[];
}

export interface AnalyzeQueryResult {
  response?: coreDefs.ResponseData;
  updated?: coreDefs.RequestData;
}

export interface CheckCacheEntryResult {
  cacheability: Cacheability;
  entry: coreDefs.PlainObjectMap | any[];
}

export interface QueryResponseCacheEntry {
  cacheMetadata: coreDefs.DehydratedCacheMetadata;
  data: coreDefs.PlainObjectMap;
}

export interface CachemapOptions {
  cacheHeaders: cachemapDefs.CacheHeaders;
  tag?: any;
}

export interface CacheManager {
  cache: Cachemap;
  analyzeQuery(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<AnalyzeQueryResult>;
  checkCacheEntry(
    cacheType: coreDefs.CacheTypes,
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<CheckCacheEntryResult | false>;
  checkQueryResponseCacheEntry(
    hash: string,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData | false>;
  resolveQuery(
    requestData: coreDefs.RequestData,
    updatedRequestData: coreDefs.RequestData,
    responseData: coreDefs.RawResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.MaybeResponseData>;
  resolveRequest(
    requestData: coreDefs.RequestData,
    responseData: coreDefs.RawResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.MaybeResponseData>;
}

export type CacheManagerInit = (options: ClientOptions) => Promise<CacheManager>;
