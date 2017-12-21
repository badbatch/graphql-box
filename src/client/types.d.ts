import Cacheability from "cacheability";
import { CacheabilityObjectMap, CacheMetadata, ObjectMap } from "../types";

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
export type PendingRequestResolver = (value: ClientResult) => void;

export interface ResolveArgs {
  cacheMetadata: CacheMetadata;
  data?: ObjectMap;
  error?: Error | Error[];
  hash?: string;
  operation: ValidOperation;
}

export type ValidOperation = "query" | "mutation";
