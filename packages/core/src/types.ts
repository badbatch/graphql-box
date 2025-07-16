import { type Metadata as CacheabilityMetadata } from 'cacheability';
import { type EventEmitter } from 'eventemitter3';
import {
  type ASTNode,
  type DocumentNode,
  type FragmentDefinitionNode,
  type GraphQLFieldResolver,
  type OperationTypeNode,
} from 'graphql';
import { type ErrorObject } from 'serialize-error';
import { type Except } from 'type-fest';
import { type WebSocket } from 'ws';

export type Ancestor = ASTNode | readonly ASTNode[];

export type CacheHeaders = Headers | { cacheControl?: string; etag?: string };

export type CacheMetadata = Record<string, CacheabilityMetadata>;

export interface DebugManagerDef extends EventEmitter {
  handleLog(message: GraphqlStep, data: LogData, logLevel?: LogLevel): void;
  log(message: GraphqlStep, data: LogData, logLevel?: LogLevel): void;
  now(): number;
}

export type FieldPath = {
  cachePaths: string[];
  responsePaths: string[];
};

export type FieldPaths = Record<string, FieldPath>;

export type FragmentDefinitionNodeMap = Record<string, FragmentDefinitionNode>;

export interface CachemapOptions {
  cacheHeaders: CacheHeaders;
  tag?: string | number;
}

export type ExecutionContextValue = PlainObject & {
  data: ExecutionContextValueData;
  debugManager: DebugManagerDef | null;
  fragmentDefinitions?: FragmentDefinitionNodeMap;
  setCacheMetadata: (key: string, headers: Headers, operation?: OperationTypeNode) => void;
};

export type ExecutionContextValueData = PlainObject & {
  operationName: string;
  originalRequestHash: string;
  requestComplexity: number | null;
  requestDepth: number | null;
  requestId: string;
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
  | 'request_resolved_from_cache'
  | 'resolver_executed'
  | 'resolver_resolved'
  | 'server_request_received'
  | 'subscription_executed'
  | 'subscription_resolved';

export type LogData = {
  data: RequestContextData;
  error?: ErrorObject;
  stats?: {
    duration?: number;
    endTime?: number;
    startTime?: number;
  };
};

export type LogLevel = 'error' | 'warn' | 'info' | 'verbose';

export type Maybe<T> = null | undefined | T;

export type PlainArray<T = unknown> = T[];

export type PlainData<T = unknown> = PlainObject<T> | PlainArray<T>;

export type PlainObject<T = unknown> = Record<string | number, T>;

export type RequestContextData = PlainObject & {
  initiator?: string;
  operation: OperationTypeNode;
  operationName: string;
  originalRequestHash: string;
  queryFiltered: boolean;
  requestComplexity: number | undefined;
  requestDepth: number | undefined;
  requestId: string;
};

export interface RequestContext {
  data: RequestContextData;
  debugManager: DebugManagerDef | undefined;
  fieldPaths: FieldPaths;
}

export interface RequestData {
  ast: DocumentNode;
  hash: string;
  request: string;
}

export interface RequestManagerDef {
  execute(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
    executeResolver: RequestResolver,
  ): Promise<ResponseData>;
}

export interface RequestOptions {
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

export type RequestResolver = (responseData: ResponseData) => Promise<ResponseData>;

export interface ResponseData {
  cacheMetadata?: CacheMetadata;
  data?: PlainObject;
  errors?: readonly Error[];
}

export interface SerialisedResponseData {
  cacheMetadata?: CacheMetadata;
  data?: PlainObject;
  errors?: ErrorObject[];
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

export type SubscriberResolver = (responseData: ResponseData) => Promise<ResponseData>;

export interface SubscriptionsManagerDef {
  subscribe(
    requestData: RequestData,
    options: RequestOptions,
    context: RequestContext,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<ResponseData>>;
}
