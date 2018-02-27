import { CacheMetadata, ObjectMap, SubscriptionsOptions } from "../types";

export interface FetchResult {
  cacheMetadata?: ObjectMap;
  data: ObjectMap;
  headers: Headers;
}

export interface ResolveArgs {
  cacheMetadata?: CacheMetadata;
  cachePromise?: Promise<void>;
  data?: ObjectMap;
  error?: Error | Error[];
  operation: ValidOperation;
  queryHash?: string;
  resolvePending?: boolean;
}

export type ValidOperation = "mutation" | "query" | "subscription";
