import Cacheability from "cacheability";

import {
  GraphQLFieldResolver,
  GraphQLSchema,
  IntrospectionQuery,
} from "graphql";

import { ObjectMap } from "../types";

export interface CachemapOptions {
  dataObjects?: any; // TODO: Replace with CachemapArgs interface
  responses?: any; // TODO: Replace with CachemapArgs interface
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

export interface ClientRequests {
  active: Map<string, string>;
  pending: Map<string, PendingRequestActions[]>;
}

export interface ClientResult {
  cacheMetadata: Map<string, Cacheability>;
  data: ObjectMap;
}

export interface CreateCacheMetadataArgs {
  cacheMetadata?: ObjectMap;
  headers?: Headers;
}

export interface DefaultCacheControls {
  mutation: string;
  query: string;
}

export interface FetchResult {
  cacheMetadata?: ObjectMap;
  data: ObjectMap;
  headers?: Headers;
}

export interface PendingRequestActions {
  reject: PendingRequestRejection;
  resolve: PendingRequestResolver;
}

export type PendingRequestRejection = (value: Error | Error[]) => void;
export type PendingRequestResolver = (value: ClientResult) => void;

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

export interface ResolveArgs {
  cacheMetadata: Map<string, Cacheability>;
  data?: ObjectMap;
  error?: Error | Error[];
  hash?: string;
  operation: ValidOperation;
}

export type ValidOperation = "query" | "mutation";
