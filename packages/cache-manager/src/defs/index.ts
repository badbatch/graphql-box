import Cachemap, { coreDefs as cachemapDefs } from "@cachemap/core";
import { coreDefs } from "@handl/core";
import { DocumentNode } from "graphql";

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
  queryPaths?: ExportCacheResult;
  responses?: ExportCacheResult;
}

export interface AnalyzeResult {
  cachedData?: coreDefs.PlainObjectMap;
  cacheMetadata?: cachemapDefs.Metadata;
  filtered?: boolean;
  updatedAST?: DocumentNode;
  updatedQuery?: string;
}

export interface CacheManager {
  dataEntities: Cachemap;
  queryPaths: Cachemap;
  responses: Cachemap;
  analyze(queryHash: string, ast: DocumentNode, context: coreDefs.RequestContext): Promise<AnalyzeResult>;
  export(): Promise<ExportCachesResult>;
  import(options: ExportCachesResult): Promise<void>;
}

export type CacheManagerInit = (options: { typeIDKey?: string; }) => CacheManager;
