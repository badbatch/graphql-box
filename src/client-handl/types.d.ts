import { CacheMetadata, ObjectMap, SubscriptionsOptions } from "../types";

/** @hidden */
export interface FetchResult {
  cacheMetadata?: ObjectMap;
  data: ObjectMap;
  headers: Headers;
}

/** @hidden */
export interface ResolveArgs {
  cacheMetadata?: CacheMetadata;
  cachePromise?: Promise<void>;
  data?: ObjectMap;
  error?: Error | Error[];
  operation: ValidOperation;
  queryHash?: string;
  resolvePending?: boolean;
}

/** @hidden */
export type ValidOperation = "mutation" | "query" | "subscription";
