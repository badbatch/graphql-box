import Cacheability from "cacheability";
import { CacheMetadata, ObjectMap, ResolveResult, RequestContext } from "../types";
import { FieldNode } from "graphql";

export interface ClientRequests {
  active: Map<string, string>;
  pending: Map<string, PendingRequestActions[]>;
}

export interface FetchResult {
  cacheMetadata?: ObjectMap;
  data: ObjectMap;
  headers?: Headers;
}

export interface MapFieldToTypeArgs {
  ancestors: any[];
  context: RequestContext;
  fieldNode: FieldNode;
  isEntity: boolean;
  resourceKey: string;
  typeName: string;
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
