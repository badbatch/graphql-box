import { CacheMetadata, ObjectMap, SubscriptionsOptions, ValidOperation } from "../types";

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
