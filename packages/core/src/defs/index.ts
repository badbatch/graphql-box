import Cacheability, { Metadata as CacheabilityMetadata } from "cacheability";
import EventEmitter from "eventemitter3";
import { DocumentNode, GraphQLFieldResolver } from "graphql";

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

export interface ServerRequestOptions {
  /**
   * Whether the request method should wait until
   * all response data has been cached before
   * returning the response data.
   */
  awaitDataCaching?: boolean;

  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  contextValue?: PlainObjectMap;

  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods.
   */
  fieldResolver?: GraphQLFieldResolver<any, any>;

  /**
   * Set GraphQL operation name to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  operationName?: string;

  /**
   * Whether to return the cache metadata along
   * with the requested data.
   */
  returnCacheMetadata?: boolean;

  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  rootValue?: any;

  /**
   * Set default GraphQL subscribe field resolver function to
   * be passed on to GraphQL's subscribe method.
   */
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;

  /**
   * An identifier that will be stored in a request's cache metadata.
   * This can be used to retrieve cache entries against.
   */
  tag?: any;
}

export type CacheTypes = "dataEntities" | "queryResponses" | "requestFieldPaths";

export interface DebugManagerDef extends EventEmitter {
  now(): number;
}

export interface PossibleType {
  isEntity: boolean;
  typeName: string;
}

export interface FieldTypeInfo {
  hasArguments: boolean;
  hasDirectives: boolean;
  isEntity: boolean;
  isInterface: boolean;
  isUnion: boolean;
  possibleTypes: PossibleType[];
  typeIDValue?: string | number;
  typeName: string;
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

export interface MaybeRequestContext {
  debugManager?: DebugManagerDef | null;
  fieldTypeMap?: FieldTypeMap;
  handlID?: string;
  operation?: ValidOperations;
  operationName?: string;
  queryFiltered?: boolean;
  request?: string;
}

export interface DehydratedCacheMetadata {
  [key: string]: CacheabilityMetadata;
}

export type CacheMetadata = Map<string, Cacheability>;

export interface RawResponseDataWithMaybeCacheMetadata {
  _cacheMetadata?: DehydratedCacheMetadata;
  data: PlainObjectMap;
  headers?: Headers;
}

export interface MaybeRawResponseData {
  _cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainObjectMap;
  errors?: Error | ReadonlyArray<Error>;
  headers?: Headers;
}

export interface ResponseData {
  cacheMetadata: CacheMetadata;
  data: PlainObjectMap;
}

export interface MaybeResponseData {
  cacheMetadata?: CacheMetadata;
  data?: PlainObjectMap;
  errors?: Error | ReadonlyArray<Error>;
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
  errors?: Error | ReadonlyArray<Error>;
}

export interface MaybeRequestResultWithDehydratedCacheMetadata {
  _cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainObjectMap;
  errors?: Error | ReadonlyArray<Error>;
}

export interface RequestManagerDef {
  execute(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
  ): Promise<MaybeRawResponseData>;
}

export type RequestManagerInit = () => Promise<RequestManagerDef>;

export type SubscriberResolver = (
  rawResponseData: MaybeRawResponseData,
) => Promise<MaybeRequestResult>;

export interface SubscriptionsManagerDef {
  subscribe(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>>;
}

export type SubscriptionsManagerInit = () => Promise<SubscriptionsManagerDef>;
