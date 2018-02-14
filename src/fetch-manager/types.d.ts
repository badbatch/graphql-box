import { FetchResult } from "../default-client/types";

export type ActiveBatch = Map<string, ActiveBatchValue>;

export interface ActiveBatchValue {
  actions: BatchResultActions;
  request: string;
}

export interface BatchActionsObjectMap {
  [key: string]: BatchResultActions
}

export interface BatchResultActions {
  reject: (reason: Error | Error[]) => void;
  resolve: (value: FetchManagerResolveResult) => void;
}

export interface FetchManagerFetchResult {
  headers: Headers;
  result: any;
}

export interface FetchManagerResolveResult {
  cacheMetadata?: ObjectMap;
  errors?: Error | Error[];
  data?: ObjectMap;
  headers?: Headers;
}
