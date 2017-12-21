import Cacheability, { CacheabilityMetadata } from "cacheability";
import { CachemapArgs } from "cachemap";

import {
  GraphQLFieldResolver,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";

export interface CacheabilityObjectMap { [key: string]: CacheabilityMetadata };
export type CacheMetadata = Map<string, Cacheability>;

export interface CachemapOptions {
  dataObjects?: CachemapArgs;
  responses?: CachemapArgs;
}

export interface ClientArgs {
  cachemapOptions?: CachemapOptions;
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

export interface ClientResult {
  cacheMetadata: CacheMetadata;
  data: ObjectMap;
}

export interface DefaultCacheControls {
  mutation: string;
  query: string;
}

export interface ObjectMap { [key: string]: any; }

export interface PostMessageArgs {
  args?: ClientArgs;
  opts?: RequestOptions;
  query?: string;
  type: string;
}

export type  PostMessageResult = RequestResult | RequestResult[] | undefined;

export interface RequestOptions {
  context?: any;
  fieldResolver?: GraphQLFieldResolver<any, any>;
  forceFetch?: boolean;
  fragments?: string[];
  headers?: ObjectMap;
  rootValue?: any;
  operationName?: string;
  variables?: ObjectMap;
}

export type RequestResult = ClientResult | ClientResult[] | Error | Error[];
