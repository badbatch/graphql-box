import { type Metadata as CacheabilityMetadata } from 'cacheability';
import { type EventEmitter } from 'eventemitter3';
import {
  type ASTNode,
  type DocumentNode,
  type FragmentDefinitionNode,
  type GraphQLErrorExtensions,
  type OperationTypeNode,
} from 'graphql';
import { type ErrorObject } from 'serialize-error';
import { type Except, type PartialDeep } from 'type-fest';
import { type WebSocket } from 'ws';

export type Ancestor = ASTNode | readonly ASTNode[];

export type CacheHeaders = Headers | { cacheControl?: string };

export type CacheMetadata = Record<string, CacheabilityMetadata>;

export interface DebugManagerDef extends EventEmitter {
  handleLog(message: GraphqlStep, data: LogData, logLevel?: LogLevel): void;
  log(message: GraphqlStep, data: LogData, logLevel?: LogLevel): void;
  now(): number;
}

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

export type ExecutionContextValue = PlainObject & {
  data: ExecutionContextValueData;
  debugManager?: DebugManagerDef;
  fragmentDefinitions?: FragmentDefinitionNodeMap;
  setCacheMetadata: (key: string, headers: Headers, operation?: OperationTypeNode) => void;
};

export type ExecutionContextValueData = PlainObject & Except<OperationContextData, 'initiator'>;

export interface FieldPathMetadataRequiredFields {
  [typeName: string]: Set<string>;
  __typename: Set<string>;
}

export type FieldPathMetadata = {
  fieldArgs?: PlainObject<unknown>;
  fieldDepth: number;
  fieldName?: string;
  hasAlias?: true;
  hasArgs?: true;
  isAbstract?: true;
  isEntity?: true;
  isLeaf?: true;
  isList?: true;
  isRootEntity?: true;
  leafEntity?: string;
  pathCacheKey: string;
  pathResponseKey: string;
  requiredFields?: FieldPathMetadataRequiredFields;
  typeConditions?: Set<string>;
  typeName: string;
};

export type FieldPaths = Record<string, FieldPathMetadata>;

export type FragmentDefinitionNodeMap = Record<string, FragmentDefinitionNode>;

export type GraphqlEnv = 'client' | 'server' | 'worker' | 'workerClient';

export type GraphqlStep =
  | 'execute_executed'
  | 'execute_resolved'
  | 'fetch_executed'
  | 'fetch_resolved'
  | 'pending_query_added'
  | 'pending_query_resolved'
  | 'operation_executed'
  | 'operation_resolved'
  | 'query_resolved_from_cache'
  | 'resolver_executed'
  | 'resolver_resolved'
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

export type OperationContextData = PlainObject<unknown> & {
  initiator?: string;
  operationId: string;
  operationMaxFieldDepth?: number;
  operationName: string;
  operationType: OperationTypeNode;
  operationTypeComplexity?: number;
  rawOperationHash: string;
};

export type OperationContext = {
  data: OperationContextData;
  debugManager?: DebugManagerDef;
  fieldPaths?: FieldPaths;
};

export type OperationData = {
  ast: DocumentNode;
  hash: string;
  operation: string;
};

export interface RequestManagerDef {
  execute(operationData: OperationData, options: OperationOptions, context: OperationContext): Promise<ResponseData>;
}

export type OperationOptions = {
  /**
   * Whether to batch the request. This defaults to the
   * batchRequest value set in @graphql-box/fetch-manager.
   */
  batch?: boolean;
  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods.
   */
  contextValue?: PlainObject<unknown> & { data?: PlainObject<unknown> };
  /**
   * A list of query fragements to be inserted
   * into the main query, mutation or subscription
   * being requested.
   */
  fragments?: string[];
  /**
   * Whether to return cache metadata in each response. Useful to
   * share cache metadata between server and client.
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
  variables?: PlainObject<unknown>;
};

export type OperationParams = {
  context: OperationContext;
  operationData: OperationData;
  options: OperationOptions;
};

export type OperationResolver = (responseData: ResponseData) => Promise<ResponseData>;

export type ResponseData<T extends PlainObject<unknown> = PlainObject<unknown>> = {
  data?: T;
  errors?: readonly Error[];
  extensions: Record<string, unknown> & { cacheMetadata: CacheMetadata };
};

export type ResponseDataWithoutErrors<T extends PlainObject<unknown> = PlainObject<unknown>> = {
  data?: T;
  extensions: Record<string, unknown> & { cacheMetadata: CacheMetadata };
};

export type SerialisedResponseData<T extends PlainObject<unknown> = PlainObject<unknown>> = {
  data?: T;
  errors?: (DeserializedGraphqlError | ErrorObject)[];
  extensions: Record<string, unknown> & { cacheMetadata: CacheMetadata };
};

export interface ServerSocketOperationOptions extends OperationOptions {
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
