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
import { type PartialDeep } from 'type-fest';
import { type WebSocket } from 'ws';

export type Ancestor = ASTNode | readonly ASTNode[];

export type CacheHeaders = Headers | { cacheControl?: string };

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

export type CachemapOptions = {
  cacheHeaders: CacheHeaders;
  tag?: string | number;
};

export type ExecutionContextValue = PlainObject & {
  data: ExecutionContextValueData;
  debugManager: DebugManagerDef | null;
  fragmentDefinitions?: FragmentDefinitionNodeMap;
  setCacheMetadata: (key: string, headers: Headers, operation?: OperationTypeNode) => void;
};

export type ExecutionContextValueData = PlainObject & {
  operationMaxFieldDepth: number | undefined;
  operationName: string;
  operationType: OperationTypeNode;
  operationTypeComplexity: number | undefined;
  originalOperationHash: string;
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
  data: OperationContextData;
  error?: ErrorObject;
  stats?: {
    duration?: number;
    endTime?: number;
    startTime?: number;
  };
};

export type LogLevel = 'error' | 'warn' | 'info' | 'verbose';

export type Maybe<T> = null | undefined | T;

export type PartialOperationContext = PartialDeep<OperationContext>;

// Needs to be kept as generic as possible, only used internally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainArray<T = any> = T[];

// Needs to be kept as generic as possible, only used internally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainData<T = any> = PlainObject<T> | PlainArray<T>;

// Needs to be kept as generic as possible, only used internally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainObject<T = any> = Record<string, T>;

export type OperationContextData = PlainObject & {
  initiator?: string;
  operationId: string;
  operationMaxFieldDepth: number | undefined;
  operationName: string;
  operationType: OperationTypeNode;
  operationTypeComplexity: number | undefined;
  originalOperationHash: string;
};

export type OperationContext = {
  data: OperationContextData;
  debugManager: DebugManagerDef | undefined;
  fieldPaths: FieldPaths | undefined;
};

export type OperationData = {
  ast: DocumentNode;
  hash: string;
  operation: string;
};

export interface OperationManagerDef {
  execute(
    operationData: OperationData,
    options: OperationOptions,
    context: OperationContext,
    executeResolver: OperationResolver,
  ): Promise<ResponseData>;
}

export type OperationOptions = {
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
};

export type OperationResolver = (responseData: ResponseData) => Promise<ResponseData>;

export type ResponseData<T extends PlainObject = PlainObject> = {
  __cacheMetadata?: CacheMetadata;
  data?: T;
  errors?: readonly Error[];
};

export type SerialisedResponseData<T extends PlainObject = PlainObject> = {
  __cacheMetadata?: CacheMetadata;
  data?: T;
  errors?: ErrorObject[];
};

export type ServerRequestOptions = {
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
   * the GraphQL execute and subscribe methods.
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
};

export interface ServerSocketRequestOptions extends ServerRequestOptions {
  /**
   * The websocket.
   */
  ws: WebSocket;
}

export type SubscriberResolver = (responseData: ResponseData) => Promise<ResponseData>;

export interface SubscriptionsManagerDef {
  subscribe(
    requestData: OperationData,
    options: OperationOptions,
    context: OperationContext,
    subscriberResolver: SubscriberResolver,
  ): Promise<AsyncIterator<ResponseData>>;
}
