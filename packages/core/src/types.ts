import { type Cacheability, type Metadata as CacheabilityMetadata } from 'cacheability';
import { type EventEmitter } from 'eventemitter3';
import {
  type ASTNode,
  type DocumentNode,
  type ExecutionResult,
  type FragmentDefinitionNode,
  type GraphQLError,
  type GraphQLErrorExtensions,
  type GraphQLFieldResolver,
  type GraphQLNamedType,
  type OperationTypeNode,
} from 'graphql';
import { type ErrorObject } from 'serialize-error';
import { type Except, type JsonObject, type JsonValue, type SetOptional } from 'type-fest';
import { type WebSocket } from 'ws';

export type Maybe<T> = null | undefined | T;

export type PlainArray<T = unknown> = T[];

export type PlainData<T = unknown> = PlainObject<T> | PlainArray<T>;

export type PlainObject<T = unknown> = Record<string | number, T>;

export type EntityData<T extends string = 'id'> = TypedData & Record<T, string | number>;

export type TypedData = PlainObject & { __typename: string };

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
  tag?: string | number;
  /**
   * Arguments to be inserted into the query, mutation or
   * subscription being requested.
   */
  variables?: PlainObject;
}

export interface ServerRequestOptions extends Except<RequestOptions, 'batch'> {
  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  contextValue?: PlainObject & { data?: PlainObject };
  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods.
   */
  fieldResolver?: GraphQLFieldResolver<unknown, unknown>;
  /**
   * Set GraphQL operation name to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  operationName?: string;
  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  rootValue?: unknown;
  /**
   * Set default GraphQL subscribe field resolver function to
   * be passed on to GraphQL's subscribe method.
   */
  subscribeFieldResolver?: GraphQLFieldResolver<unknown, unknown>;
}

export interface ServerSocketRequestOptions extends ServerRequestOptions {
  /**
   * The websocket.
   */
  ws: WebSocket;
}

export type CacheTypes = 'dataEntities' | 'queryResponses' | 'requestFieldPaths';

export type CacheHeaders = Headers | { cacheControl?: string; etag?: string };

export interface CachemapOptions {
  cacheHeaders: CacheHeaders;
  tag?: string | number;
}

export type ExecutionContextValueData = PlainObject & {
  operationName: string;
  originalRequestHash: string;
  requestComplexity: number | null;
  requestDepth: number | null;
  requestID: string;
};

export type ExecutionContextValue = PlainObject & {
  data: ExecutionContextValueData;
  debugManager: DebugManagerDef | null;
  fragmentDefinitions?: FragmentDefinitionNodeMap;
  setCacheMetadata: (key: string, headers: Headers, operation?: OperationTypeNode) => void;
};

export type GraphqlEnv = 'client' | 'server' | 'worker' | 'workerClient';

export type GraphqlStep =
  | 'cache_entry_added'
  | 'cache_entry_queried'
  | 'execute_executed'
  | 'execute_resolved'
  | 'fetch_executed'
  | 'fetch_resolved'
  | 'partial_query_compiled'
  | 'pending_query_added'
  | 'pending_query_resolved'
  | 'request_executed'
  | 'request_resolved'
  | 'resolver_executed'
  | 'resolver_resolved'
  | 'server_request_received'
  | 'subscription_executed'
  | 'subscription_resolved';

export type LogData = {
  cachemapOptions?: CachemapOptions;
  context?: Omit<RequestContext, 'debugManager'>;
  options?: RequestOptions | ServerRequestOptions;
  result?: Omit<PartialRequestResult, '_cacheMetadata'> & { cacheMetadata?: CacheMetadata };
  stats?: {
    duration: number;
    endTime: number;
    startTime: number;
  };
  value?: JsonValue;
};

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

export type LogEntry = {
  '@timestamp': string;
  ecs: {
    version: string;
  };
  err?: Error | (DeserializedGraphqlError | ErrorObject);
  id: string;
  labels: {
    cacheType: string;
    duration: number;
    endTime: number;
    environment: GraphqlEnv;
    hasDeferOrStream: boolean;
    logGroup: number;
    logOrder: number;
    nodeVersion?: string;
    operation: OperationTypeNode;
    operationName: string;
    originalRequestHash: string;
    osPlatform?: string;
    path?: string;
    port?: string;
    protocol?: string;
    queryFiltered: boolean;
    queryString?: string;
    request: string;
    requestComplexity?: number;
    requestDepth?: number;
    requestHash: string;
    requestID: string;
    result: string;
    returnCacheMetadata: boolean;
    startTime: number;
    url?: string;
    userAgent?: string;
    variables: JsonObject;
  };
  log: {
    level: LogLevel;
    logger: string;
  };
  message: GraphqlStep;
};

export interface DebugManagerDef extends EventEmitter {
  handleLog(message: string, data: PlainData, logLevel?: LogLevel): void;
  log(message: string, data: PlainData, logLevel?: LogLevel): void;
  now(): number;
}

export interface PossibleType {
  isEntity: boolean;
  typeName: string;
}

export type VariableTypesMap = Record<string, Maybe<GraphQLNamedType>>;

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

export type FragmentDefinitionNodeMap = Record<string, FragmentDefinitionNode>;

export interface RequestContext {
  debugManager: DebugManagerDef | null;
  experimentalDeferStreamSupport: boolean;
  fieldTypeMap: FieldTypeMap;
  filteredRequest: string;
  hasDeferOrStream?: boolean;
  normalizePatchResponseData?: boolean;
  operation: OperationTypeNode;
  operationName: string;
  originalRequestHash: string;
  parsedRequest: string;
  queryFiltered: boolean;
  request: string;
  requestComplexity: number | null;
  requestDepth: number | null;
  requestID: string;
}

export type PartialRequestContext = Partial<RequestContext>;

export type DehydratedCacheMetadata = Record<string, CacheabilityMetadata>;

export type CacheMetadata = Map<string, Cacheability>;

export type DeserializedGraphqlError = {
  extensions: GraphQLErrorExtensions;
  message: string;
  name: 'GraphQLError';
  nodes: ASTNode | ASTNode[];
  originalError: ErrorObject;
  path: string[];
  positions: number[];
  source: {
    body: string;
    locationOffset: {
      column: number;
      line: number;
    };
    name: string;
  };
  stack: string;
};

export interface ExecutionPatchResult<TData = PlainObject, TExtensions = PlainObject> {
  data?: TData | null;
  errors?: readonly GraphQLError[];
  extensions?: TExtensions;
  hasNext: boolean;
  label?: string;
  path?: readonly (string | number)[];
}

export declare type AsyncExecutionResult = ExecutionResult | ExecutionPatchResult;

export interface PartialRawFetchData {
  _cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainData;
  errors?: (DeserializedGraphqlError | ErrorObject)[];
  hasNext?: boolean;
  headers?: Headers;
  label?: string;
  paths?: string[];
}

export interface RawResponseDataWithMaybeCacheMetadata {
  _cacheMetadata?: DehydratedCacheMetadata;
  data: PlainData;
  hasNext?: boolean;
  headers?: Headers;
  label?: string;
  paths?: string[];
}

export interface PartialRawResponseData {
  _cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainData | null;
  errors?: readonly Error[];
  hasNext?: boolean;
  headers?: Headers;
  label?: string;
  paths?: string[];
}

export interface ResponseData {
  cacheMetadata: CacheMetadata;
  data: PlainData;
  hasNext?: boolean;
  paths?: string[];
}

export interface PartialResponseData {
  cacheMetadata?: CacheMetadata;
  data?: PlainData | null;
  errors?: readonly Error[];
  hasNext?: boolean;
  paths?: string[];
}

export interface RequestData {
  ast: DocumentNode;
  hash: string;
  request: string;
}

export interface RequestResult<Data = PlainData> {
  /**
   * A map of query paths to their cacheability
   * information.
   */
  _cacheMetadata?: CacheMetadata;
  /**
   * The data requested in a query, mutation or subscription.
   */
  data: Data;
  /**
   * Any errors thrown during the request.
   */
  errors?: readonly Error[];
  /**
   * Unique identifier for a given request.
   */
  requestID: string;
}

export interface PartialRequestResult<Data = PlainData | null> {
  /**
   * A map of query paths to their cacheability
   * information.
   */
  _cacheMetadata?: CacheMetadata;
  /**
   * The data requested in a query, mutation or subscription.
   */
  data?: Data;
  /**
   * Any errors thrown during the request.
   */
  errors?: readonly Error[];
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

export interface PartialDehydratedRequestResult {
  _cacheMetadata?: DehydratedCacheMetadata;
  data?: PlainData | null;
  errors?: (DeserializedGraphqlError | ErrorObject)[];
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
  ): Promise<AsyncIterableIterator<PartialRequestResult | undefined> | PartialRawResponseData>;
}

export type RequestResolver = (rawResponseData: PartialRawResponseData) => Promise<PartialRequestResult>;

export type SubscriberResolver = (rawResponseData: PartialRawResponseData) => Promise<PartialRequestResult>;

export interface SubscriptionsManagerDef {
  subscribe(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<PartialRequestResult | undefined>>;
}

export interface MockResponsesOptions {
  allowPassThrough?: boolean;
  enabled: boolean;
}

export type ResponseMock =
  | (PartialRawFetchData | AsyncGenerator<Response>)
  | ((
      requestData: SetOptional<RequestData, 'ast'>,
      options: RequestOptions,
      context: Partial<RequestContext>,
    ) => PartialRawFetchData | AsyncGenerator<Response>);
