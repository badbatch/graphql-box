import Cacheability from "cacheability";

import {
  CacheabilityObjectMap,
  CacheMetadata,
  ResolveResult,
  DataCachedResolver,
  ObjectMap
} from "../types";

export interface ClientRequests {
  active: Map<string, string>;
  pending: Map<string, PendingRequestActions[]>;
}

export interface CreateCacheMetadataArgs {
  cacheMetadata?: CacheabilityObjectMap;
  headers?: Headers;
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
export type PendingRequestResolver = (value: ResolveResult) => void;

export interface ResolveArgs {
  cacheMetadata: CacheMetadata;
  cachePromise?: Promise<void>;
  data?: ObjectMap;
  error?: Error | Error[];
  operation: ValidOperation;
  queryHash?: string;
  resolvePending?: boolean;
}

export type ValidOperation = "query" | "mutation";
