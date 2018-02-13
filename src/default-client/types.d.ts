import { CacheMetadata, ObjectMap, RequestContext } from "../types";
import { FieldNode } from "graphql";

export interface FetchResult {
  cacheMetadata?: ObjectMap;
  data: ObjectMap;
  headers: Headers;
}

export interface MapFieldToTypeArgs {
  ancestors: any[];
  context: RequestContext;
  fieldNode: FieldNode;
  isEntity: boolean;
  resourceKey: string;
  typeName: string;
  variables?: ObjectMap;
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
