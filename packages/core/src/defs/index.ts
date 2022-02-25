import Cacheability, { Metadata as CacheabilityMetadata } from "cacheability";
import EventEmitter from "eventemitter3";
import { DocumentNode, GraphQLFieldResolver, GraphQLNamedType } from "graphql";
import WebSocket from "ws";

export type Maybe<T> = null | undefined | T;

export interface PlainObjectMap<T = any> {
  [key: string]: T;
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
   * A list of query fragements to be inserted
   * into the main query, mutation or subscription
   * being requested.
   */
  fragments?: string[];

  /**
   * Whether to return the cache metadata along
   * with the requested data.
   */
  returnCacheMetadata?: boolean;

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

export interface ServerSocketRequestOptions extends ServerRequestOptions {
  /**
   * The websocket.
   */
  ws: WebSocket;
}

export type CacheTypes = "dataEntities" | "queryResponses" | "requestFieldPaths";

export interface DebugManagerDef extends EventEmitter {
  now(): number;
}

export interface PossibleType {
  isEntity: boolean;
  typeName: string;
}

export interface VariableTypesMap {
  [key: string]: Maybe<GraphQLNamedType>;
}

export interface FieldTypeInfo {
  directives: {
    inherited: string[];
    own: string[];
  };
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
  boxID: string;
  debugManager: DebugManagerDef | null;
  fieldTypeMap: FieldTypeMap;
  hasDeferOrStream?: boolean;
  normalizePatchResponseData?: boolean;
  operation: ValidOperations;
  operationName: string;
  queryFiltered: boolean;
  request: string;
}

export interface MaybeRequestContext {
  boxID?: string;
  debugManager?: DebugManagerDef | null;
  fieldTypeMap?: FieldTypeMap;
  hasDeferOrStream?: boolean;
  normalizePatchResponseData?: boolean;
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
  hasNext?: boolean;
  headers?: Headers;
  label?: string;
  paths?: string[];
}

export interface MaybeRawResponseData {
  _cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainObjectMap | null;
  errors?: Error | ReadonlyArray<Error>;
  hasNext?: boolean;
  headers?: Headers;
  label?: string;
  paths?: string[];
}

export interface ResponseData {
  cacheMetadata: CacheMetadata;
  data: PlainObjectMap;
  hasNext?: boolean;
  paths?: string[];
}

export interface MaybeResponseData {
  cacheMetadata?: CacheMetadata;
  data?: PlainObjectMap | null;
  errors?: Error | ReadonlyArray<Error>;
  hasNext?: boolean;
  paths?: string[];
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
  data?: PlainObjectMap | null;

  /**
   * Any errors thrown during the request.
   */
  errors?: Error | ReadonlyArray<Error>;

  /**
   * Whether there are any more chunks to the response.
   */
  hasNext?: boolean;

  /**
   * Key paths for data returned in subsequent responeses for defer/stream requests.
   */
  paths?: string[];

  /**
   * Unique identifier for a given request.
   */
  requestID: string;
}

export interface MaybeRequestResultWithDehydratedCacheMetadata {
  _cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainObjectMap | null;
  errors?: Error | ReadonlyArray<Error>;
  hasNext?: boolean;
  paths?: string[];
  requestID: string;
}

export interface RequestManagerDef {
  execute(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
    executeResolver: RequestResolver,
  ): Promise<AsyncIterableIterator<MaybeRequestResult | undefined> | MaybeRawResponseData>;
}

export type RequestManagerInit = () => Promise<RequestManagerDef>;

export type RequestResolver = (rawResponseData: MaybeRawResponseData) => Promise<MaybeRequestResult>;

export type SubscriberResolver = (rawResponseData: MaybeRawResponseData) => Promise<MaybeRequestResult>;

export interface SubscriptionsManagerDef {
  subscribe(
    requestData: RequestDataWithMaybeAST,
    options: RequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>>;
}

export type SubscriptionsManagerInit = () => Promise<SubscriptionsManagerDef>;
