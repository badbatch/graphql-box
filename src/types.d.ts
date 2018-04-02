import { Cacheability, CacheabilityMetadata } from "cacheability";

import {
  CachemapArgs,
  CachemapClientStoreTypes,
  CachemapMetadata,
  CachemapServerStoreTypes,
} from "cachemap";

import {
  DocumentNode,
  GraphQLFieldResolver,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";

import * as WebSocket from "ws";

/** @hidden */
export interface AnalyzeResult {
  cachedData?: ObjectMap;
  cacheMetadata?: CacheMetadata;
  filtered?: boolean;
  updatedAST?: DocumentNode;
  updatedQuery?: string;
}

export type CacheMetadata = Map<string, Cacheability>;

/** @hidden */
export interface CachemapArgsGroup {
  dataEntities: CachemapArgs;
  queryPaths: CachemapArgs;
  responses: CachemapArgs;
  [key: string]: CachemapArgs;
}

export interface CachemapOptions extends CachemapArgs {
  name?: string;
  use?: { client?: CachemapClientStoreTypes, server?: CachemapServerStoreTypes };
}

export interface CachemapOptionsGroup {
  dataEntities?: CachemapOptions;
  queryPaths?: CachemapOptions;
  responses?: CachemapOptions;
}

export interface ClientArgs {
  /**
   * Whether a client should batch query and mutation
   * requests. Only applicable for `ClientHandl` and `WorkerHandl`.
   *
   */
  batch?: boolean;
  /**
   * The configuration options to be passed through
   * to the `Cachemap` instances used for persisted
   * storage.
   *
   */
  cachemapOptions?: CachemapOptionsGroup | CachemapOptions;
  /**
   * The default cache control directives to be used
   * for queries, mutations and subscriptions.
   *
   */
  defaultCacheControls?: DefaultCacheControls;
  /**
   * How long handl should wait for a server to
   * respond before timing out. Only applicable for
   * `ClientHandl` and `WorkerHandl`.
   *
   */
  fetchTimeout?: number;
  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods. Only applicable for `ServerHandl`.
   *
   */
  fieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * Additional headers to be sent with every request. Only
   * applicable for `ClientHandl` and `WorkerHandl`.
   *
   */
  headers?: ObjectMap;
  /**
   * Output of an introspection query. Only applicable
   * for `ClientHandl` and `WorkerHandl`.
   *
   */
  introspection?: IntrospectionQuery;
  /**
   * Whether handl is being used as a client or as a server.
   *
   */
  mode?: "default" | "server";
  /**
   * Whether to return a new instance of handl or the
   * existing instance, if one exists.
   *
   */
  newInstance?: boolean;
  /**
   * The name of the property thats value is used as the unique
   * identifier for each resource/entity in the GraphQL schema.
   *
   */
  resourceKey?: string;
  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods. Only
   * applicable for `ServerHandl`.
   *
   */
  rootValue?: any;
  /**
   * The GraphQL schema to be passed on to
   * GraphQL's execute and subscribe methods. Only
   * applicable for `ServerHandl`.
   *
   */
  schema?: GraphQLSchema;
  /**
   * Set default GraphQL subscribe field resolver function to
   * be passed on to GraphQL's subscribe method. Only applicable
   * for `ServerHandl`.
   *
   */
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * The configuration object to be passed to handl's socket manager.
   * Only applicable for `ClientHandl` and `WorkerHandl`.
   *
   */
  subscriptions?: SubscriptionsOptions;
  /**
   * The endpoint that handl will use to communicate with the
   * GraphQL server for queries and mutations. Only applicable
   * for `ClientHandl` and `WorkerHandl`.
   *
   */
  url?: string;
}

/** @hidden */
export interface ClientRequests {
  active: Map<string, string>;
  pending: Map<string, PendingRequestActions[]>;
}

/** @hidden */
export interface CreateCacheMetadataArgs {
  cacheMetadata?: DehydratedCacheMetadata;
  headers?: Headers;
}

/** @hidden */
export type DataCachedResolver = () => void;

export interface DefaultCacheControls {
  mutation: string;
  query: string;
  subscription: string;
  [key: string]: string;
}

export interface DehydratedCacheMetadata { [key: string]: CacheabilityMetadata; }

/** @hidden */
export interface DehydratedRequestResultData {
  cacheMetadata: DehydratedCacheMetadata;
  data: ObjectMap;
  queryHash?: string;
}

export interface ExportCacheResult {
  entries: Array<[string, any]>;
  metadata: CachemapMetadata[];
}

export interface ExportCachesResult {
  dataEntities?: ExportCacheResult;
  queryPaths?: ExportCacheResult;
  responses?: ExportCacheResult;
}

/** @hidden */
export interface FetchManagerArgs {
  batch?: boolean;
  fetchTimeout?: number;
  headers?: ObjectMap;
  url: string;
}

/** @hidden */
export interface FieldTypeInfo {
  hasArguments: boolean;
  hasDirectives: boolean;
  isEntity: boolean;
  resourceValue?: string | number;
  typeName: string;
}

/** @hidden */
export type FieldTypeMap = Map<string, FieldTypeInfo>;
export interface ObjectMap { [key: string]: any; }
/** @hidden */
export interface StringObjectMap { [key: string]: string; }

/** @hidden */
export interface PendingRequestActions {
  reject: PendingRequestRejection;
  resolve: PendingRequestResolver;
}

/** @hidden */
export type PendingRequestRejection = (value: Error | Error[]) => void;
/** @hidden */
export type PendingRequestResolver = (value: ResolveResult) => void;

/** @hidden */
export interface PostMessageArgs {
  args?: ClientArgs;
  caches?: ExportCachesResult;
  eventName?: string;
  key?: string;
  opts?: RequestOptions;
  query?: string;
  tag?: any;
  type: string;
}

/** @hidden */
export interface RequestContext {
  cache?: "responses" | "queryPaths" | "dataEntities";
  fieldTypeMap: FieldTypeMap;
  handlID: string;
  operation: string;
}

/** @hidden */
export interface RequestExecutorResolveResult {
  cacheMetadata?: ObjectMap;
  errors?: Error | Error[];
  data?: ObjectMap;
  headers?: Headers;
}

export interface RequestOptions {
  /**
   * Whether the request method should wait until
   * all response data has been cached before
   * returning the response data. Only applicable for
   * `ClientHandl` and `WorkerHandl`.
   *
   */
  awaitDataCached?: boolean;
  /**
   * Set GraphQL context value to be passed on to
   * GraphQL's execute and subscribe methods. Only
   * applicable for `ServerHandl`.
   *
   */
  contextValue?: any;
  /**
   * Set default GraphQL field resolver function to
   * be passed on to GraphQL's execute and subscribe
   * methods. Only applicable for `ServerHandl`.
   *
   */
  fieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * A list of query fragements to be inserted
   * into the main query, mutation or subscription
   * being requested. Only applicable for `ClientHandl`
   * and `WorkerHandl`.
   *
   */
  fragments?: string[];
  /**
   * Set GraphQL operation name to be passed on to
   * GraphQL's execute and subscribe methods. Only
   * applicable for `ServerHandl`.
   *
   */
  operationName?: string;
  /**
   * Set default GraphQL root value to be passed on to
   * GraphQL's execute and subscribe methods. Only
   * applicable for `ServerHandl`.
   *
   */
  rootValue?: any;
  /**
   * Set default GraphQL subscribe field resolver function to
   * be passed on to GraphQL's subscribe method. Only applicable
   * for `ServerHandl`.
   *
   */
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
  /**
   * An identifier that will be stored in a request's cache metadata.
   * This can be used to retrieve cache entries against.
   *
   */
  tag?: any;
  /**
   * Arguments to be inserted into the query, mutation or
   * subscription being requested. Only applicable for `ClientHandl`
   * and `WorkerHandl`.
   *
   */
  variables?: ObjectMap;
}

export type RequestResult = RequestResultData | AsyncIterator<any>;

export interface RequestResultData {
  /**
   * A map of query paths to their cacheability
   * information. This is used by handl to cache
   * the data correctly.
   *
   */
  cacheMetadata: CacheMetadata;
  /**
   * The data requested in a query, mutation or subscription.
   *
   */
  data: ObjectMap;
  /**
   * A hash of the query that was requested.
   *
   */
  queryHash?: string;
}

/** @hidden */
export interface ResolveResult {
  cacheMetadata: CacheMetadata;
  cachePromise?: Promise<void>;
  data: ObjectMap;
  queryHash?: string;
}

export interface ResponseCacheEntryResult {
  cacheMetadata: CacheMetadata;
  data: ObjectMap;
}

/** @hidden */
export type SubscriberResolver = (data: any) => Promise<ResolveResult>;

export interface SubscriptionsOptions {
  address: string;
  opts?: WebSocket.ClientOptions;
}
