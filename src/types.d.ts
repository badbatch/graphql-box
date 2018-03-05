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
  dataPaths: CachemapArgs;
  responses: CachemapArgs;
}

export interface CachemapOptions extends CachemapArgs {
  name?: string;
  use?: { client?: CachemapClientStoreTypes, server?: CachemapServerStoreTypes };
}

export interface CachemapOptionsGroup {
  dataEntities?: CachemapOptions;
  dataPaths?: CachemapOptions;
  responses?: CachemapOptions;
}

export interface ClientArgs {
  batch?: boolean;
  cachemapOptions?: CachemapOptionsGroup;
  defaultCacheControls?: DefaultCacheControls;
  fetchTimeout?: number;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  headers?: ObjectMap;
  introspection?: IntrospectionQuery;
  mode?: "default" | "server";
  newInstance?: boolean;
  resourceKey?: string;
  rootValue?: any;
  schema?: GraphQLSchema;
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
  subscriptions?: SubscriptionsOptions;
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
  dataPaths?: ExportCacheResult;
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
  key?: string;
  opts?: RequestOptions;
  query?: string;
  tag?: any;
  type: string;
}

/** @hidden */
export interface RequestContext {
  fieldTypeMap: FieldTypeMap;
}

/** @hidden */
export interface RequestExecutorResolveResult {
  cacheMetadata?: ObjectMap;
  errors?: Error | Error[];
  data?: ObjectMap;
  headers?: Headers;
}

export interface RequestOptions {
  awaitDataCached?: boolean;
  contextValue?: any;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  forceFetch?: boolean;
  fragments?: string[];
  operationName?: string;
  rootValue?: any;
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
  tag?: any;
  variables?: ObjectMap;
}

export type RequestResult = RequestResultData | AsyncIterator<any>;

export interface RequestResultData {
  cacheMetadata: CacheMetadata;
  data: ObjectMap;
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
