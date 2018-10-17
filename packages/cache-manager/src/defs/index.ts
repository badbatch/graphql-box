import Cachemap, { coreDefs as cachemapDefs } from "@cachemap/core";
import { coreDefs } from "@handl/core";

/**
 * Base options.
 */
export interface BaseOptions {
  /**
   * An object map of GraphQL schema types to cache-control
   * directives used for caching object types.
   */
  typeCacheDirectives?: coreDefs.PlainObjectStringMap;
}

export interface ExportCacheResult {
  entries: Array<[string, any]>;
  metadata: cachemapDefs.Metadata[];
}

export interface ExportCachesResult {
  dataEntities?: ExportCacheResult;
  queryResponses?: ExportCacheResult;
  requestFieldPaths?: ExportCacheResult;
}

export interface AnalyzeQueryResult {
  response?: coreDefs.ResponseData;
  updated?: coreDefs.RequestData;
}

export interface CacheManager {
  dataEntities: Cachemap;
  queryResponses: Cachemap;
  requestFieldPaths: Cachemap;
  analyzeQuery(
    requestData: coreDefs.RequestData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<AnalyzeQueryResult>;
  check(
    cacheType: coreDefs.CacheTypes,
    requestData: coreDefs.RequestData,
  ): Promise<coreDefs.ResponseData | false>;
  export(): Promise<ExportCachesResult>;
  import(options: ExportCachesResult): Promise<void>;
  resolve(
    requestData: coreDefs.RequestData,
    rawResponseData: coreDefs.RawResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData>;
  resolveQuery(
    requestData: coreDefs.RequestData,
    updatedRequestData: coreDefs.RequestData,
    rawResponseData: coreDefs.RawResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<coreDefs.ResponseData>;
  set(
    cacheType: coreDefs.CacheTypes,
    responseData: coreDefs.ResponseData,
    options: coreDefs.RequestOptions,
    context: coreDefs.RequestContext,
  ): Promise<void>;
}

export type CacheManagerInit = (options: { typeIDKey?: string; }) => CacheManager;
