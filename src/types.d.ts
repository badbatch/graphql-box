import Cacheability, { CacheabilityMetadata } from "cacheability";

import {
  CachemapArgs,
  CachemapClientStoreTypes,
  CachemapServerStoreTypes,
} from "cachemap";

import {
  GraphQLFieldResolver,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";

export interface CacheabilityObjectMap { [key: string]: CacheabilityMetadata; }
export type CacheMetadata = Map<string, Cacheability>;

export interface CachemapArgsGroup {
  dataObjects: CachemapArgs;
  responses: CachemapArgs;
}

export interface CachemapOptions extends CachemapArgs {
  name?: string;
  use?: { client?: CachemapClientStoreTypes, server?: CachemapServerStoreTypes };
}

export interface CachemapOptionsGroup {
  dataObjects?: CachemapOptions;
  responses?: CachemapOptions;
}

export interface ClientArgs {
  cachemapOptions?: CachemapOptionsGroup;
  defaultCacheControls?: DefaultCacheControls;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  headers?: ObjectMap;
  introspection?: IntrospectionQuery;
  mode: "internal" | "external";
  newInstance?: boolean;
  resourceKey?: string;
  rootValue?: any;
  schema?: GraphQLSchema;
  url?: string;
}

export interface CreateCacheMetadataArgs {
  cacheMetadata?: CacheabilityObjectMap;
  headers?: Headers;
}

export type DataCachedResolver = () => void;

export interface DefaultCacheControls {
  mutation: string;
  query: string;
}

export type FieldTypeMap = Map<string, { resourceKey: string, resourceValue?: string, typeName: string }>;
export interface ObjectMap { [key: string]: any; }

export interface PostMessageArgs {
  args?: ClientArgs;
  key?: string;
  opts?: RequestOptions;
  query?: string;
  type: string;
}

export interface PostMessageResult {
  cacheMetadata: CacheabilityObjectMap;
  data: ObjectMap;
  queryHash?: string;
}

export interface RequestContext {
  fieldTypeMaps: FieldTypeMap[];
}

export interface RequestOptions {
  awaitDataCached?: boolean;
  context?: any;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  forceFetch?: boolean;
  fragments?: string[];
  headers?: ObjectMap;
  rootValue?: any;
  operationName?: string;
  variables?: ObjectMap;
}

export interface RequestResult {
  cacheMetadata: CacheMetadata;
  data: ObjectMap;
  queryHash?: string;
}

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
