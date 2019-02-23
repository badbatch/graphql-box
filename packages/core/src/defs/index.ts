import Cacheability, { Metadata as CacheabilityMetadata } from "cacheability";
import EventEmitter from "eventemitter3";
import { DocumentNode } from "graphql";

export interface PlainObjectMap {
  [key: string]: any;
}

export interface PlainObjectStringMap {
  [key: string]: string;
}

export interface RequestOptions {
  /**
   * Whether the request method should wait until
   * all response data has been cached before
   * returning the response data.
   */
  awaitDataCaching?: boolean;

  /**
   * Whether to return the cache metadata along
   * with the requested data.
   */
  returnCacheMetadata?: boolean;

  /**
   * A list of query fragements to be inserted
   * into the main query, mutation or subscription
   * being requested.
   */
  fragments?: string[];

  /**
   * An identifier that will be stored in a request's cache metadata.
   * This can be used to retrieve cache entries against.
   */
  tag?: any;

  /**
   * Arguments to be inserted into the query, mutation or
   * subscription being requested.
   */
  variables?: PlainObjectMap;
}

export type CacheTypes = "dataEntities" | "queryResponses" | "requestFieldPaths";

export interface DebugManagerDef extends EventEmitter {
  emit(event: string, props: PlainObjectMap): boolean;
  now(): number;
}

export interface FieldTypeInfo {
  hasArguments: boolean;
  hasDirectives: boolean;
  isEntity: boolean;
  typeIDValue?: string | number;
  typeName: string;
  unionTypeNames: string[];
}

export type FieldTypeMap = Map<string, FieldTypeInfo>;

export type ValidOperations = "mutation" | "query" | "subscription";

export interface RequestContext {
  debugManager: DebugManagerDef | null;
  fieldTypeMap: FieldTypeMap;
  handlID: string;
  operation: ValidOperations;
  operationName: string;
  queryFiltered: boolean;
  request: string;
}

export interface DehydratedCacheMetadata {
  [key: string]: CacheabilityMetadata;
}

export type CacheMetadata = Map<string, Cacheability>;

export interface RawResponseDataWithMaybeCacheMetadata {
  cacheMetadata?: DehydratedCacheMetadata;
  data: PlainObjectMap;
  headers: Headers;
}

export interface MaybeRawResponseData {
  cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainObjectMap;
  errors?: Error | Error[];
  headers: Headers;
}

export interface ResponseData {
  cacheMetadata: CacheMetadata;
  data: PlainObjectMap;
}

export interface MaybeResponseData {
  cacheMetadata?: CacheMetadata;
  data?: PlainObjectMap;
  errors?: Error | Error[];
}

export interface RequestDataWithMaybeAST {
  ast?: DocumentNode;
  hash: string;
  request: string;
}

export interface RequestData {
  ast: DocumentNode;
  hash: string;
  request: string;
}

export interface MaybeRequestResult {
  /**
   * A map of query paths to their cacheability
   * information.
   */
  _cacheMetadata?: CacheMetadata;

  /**
   * The data requested in a query, mutation or subscription.
   */
  data?: PlainObjectMap;

  /**
   * Any errors thrown during the request.
   */
  errors?: Error | Error[];
}
