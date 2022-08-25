import Cacheability, { Metadata as CacheabilityMetadata } from "cacheability";
import EventEmitter from "eventemitter3";
import { DocumentNode, FragmentDefinitionNode, GraphQLFieldResolver, GraphQLNamedType } from "graphql";
import { ErrorObject } from "serialize-error";
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
   * Whether to batch the request. This defaults to the
   * batchRequest value set in @graphql-box/fetch-manager.
   */
  batch?: boolean;

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

export interface FragmentDefinitionNodeMap {
  [key: string]: FragmentDefinitionNode;
}

export type ValidOperations = "mutation" | "query" | "subscription";

export interface RequestContext {
  debugManager: DebugManagerDef | null;
  fieldTypeMap: FieldTypeMap;
  hasDeferOrStream?: boolean;
  normalizePatchResponseData?: boolean;
  operation: ValidOperations;
  operationName: string;
  queryFiltered: boolean;
  request: string;
  requestID: string;
  whitelistHash: string;
}

export interface MaybeRequestContext {
  debugManager?: DebugManagerDef | null;
  fieldTypeMap?: FieldTypeMap;
  hasDeferOrStream?: boolean;
  normalizePatchResponseData?: boolean;
  operation?: ValidOperations;
  operationName?: string;
  queryFiltered?: boolean;
  request?: string;
  requestID?: string;
  whitelistHash?: string;
}

export interface DehydratedCacheMetadata {
  [key: string]: CacheabilityMetadata;
}

export type CacheMetadata = Map<string, Cacheability>;

export interface MaybeRawFetchData {
  _cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainObjectMap;
  errors?: ErrorObject[];
  hasNext?: boolean;
  headers?: Headers;
  label?: string;
  paths?: string[];
}

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
  errors?: ReadonlyArray<Error>;
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
  errors?: ReadonlyArray<Error>;
  hasNext?: boolean;
  paths?: string[];
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
  errors?: ReadonlyArray<Error>;

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
  errors?: ReadonlyArray<Error>;
  hasNext?: boolean;
  paths?: string[];
  requestID: string;
}

export interface RequestManagerDef {
  execute(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
    executeResolver: RequestResolver,
  ): Promise<AsyncIterableIterator<MaybeRequestResult | undefined> | MaybeRawResponseData>;
}

export type RequestManagerInit = () => RequestManagerDef;

export type RequestResolver = (rawResponseData: MaybeRawResponseData) => Promise<MaybeRequestResult>;

export type SubscriberResolver = (rawResponseData: MaybeRawResponseData) => Promise<MaybeRequestResult>;

export interface SubscriptionsManagerDef {
  subscribe(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<MaybeRequestResult | undefined>>;
}

export type SubscriptionsManagerInit = () => SubscriptionsManagerDef;
