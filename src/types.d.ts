import { Cacheability, CacheabilityMetadata } from "cacheability";

import {
  CachemapArgs,
  CachemapClientStoreTypes,
  CachemapServerStoreTypes,
} from "cachemap";

import {
  DocumentNode,
  GraphQLFieldResolver,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";

import * as WebSocket from "ws";

export interface AnalyzeResult {
  cachedData?: ObjectMap;
  cacheMetadata?: CacheMetadata;
  filtered?: boolean;
  updatedAST?: DocumentNode;
  updatedQuery?: string;
}

export interface CacheabilityObjectMap { [key: string]: CacheabilityMetadata; }
export type CacheMetadata = Map<string, Cacheability>;

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
  cachemapOptions?: CachemapOptionsGroup;
  defaultCacheControls?: DefaultCacheControls;
  headers?: ObjectMap;
  introspection: IntrospectionQuery | string;
  newInstance?: boolean;
  resourceKey?: string;
  subscriptions?: SubscriptionsOptions;
  url: string;
}

export interface ClientRequests {
  active: Map<string, string>;
  pending: Map<string, PendingRequestActions[]>;
}

export interface CreateCacheMetadataArgs {
  cacheMetadata?: CacheabilityObjectMap;
  headers?: Headers;
}

export type DataCachedResolver = () => void;

export interface DefaultCacheControls {
  mutation: string;
  query: string;
  subscription: string;
  [key: string]: string;
}

export interface FieldTypeInfo {
  hasArguments: boolean;
  isEntity: boolean;
  resourceValue?: string | number;
  typeName: string;
}

export type FieldTypeMap = Map<string, FieldTypeInfo>;
export interface ObjectMap { [key: string]: any; }

export interface PendingRequestActions {
  reject: PendingRequestRejection;
  resolve: PendingRequestResolver;
}

export type PendingRequestRejection = (value: Error | Error[]) => void;
export type PendingRequestResolver = (value: ResolveResult) => void;

export interface PostMessageArgs {
  args?: ClientArgs;
  key?: string;
  opts?: RequestOptions;
  query?: string;
  type: string;
}

export interface PostMessageResult {
  cacheMetadata?: CacheabilityObjectMap;
  data: ObjectMap;
  queryHash?: string;
}

export interface RequestContext {
  fieldTypeMap: FieldTypeMap;
}

export interface RequestOptions {
  awaitDataCached?: boolean;
  context?: any;
  forceFetch?: boolean;
  fragments?: string[];
  headers?: ObjectMap;
  variables?: ObjectMap;
}

export type RequestResult = RequestResultData | AsyncIterator<Event | undefined>;

export interface RequestResultData {
  cacheMetadata?: CacheMetadata;
  data: ObjectMap;
  queryHash?: string;
}

export interface ResolveResult {
  cacheMetadata?: CacheMetadata;
  cachePromise?: Promise<void>;
  data: ObjectMap;
  queryHash?: string;
}

export interface ResponseCacheEntryResult {
  cacheMetadata: CacheMetadata;
  data: ObjectMap;
}

export type SubscriberResolver = (data: any) => Promise<ResolveResult>;

export interface SubscriptionsOptions {
  address: string;
  opts?: WebSocket.ClientOptions;
}
