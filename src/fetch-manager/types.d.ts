import { FetchResult } from "../default-client/types";
import { RequestExecutorResolveResult } from "../types";

export type ActiveBatch = Map<string, ActiveBatchValue>;

export interface ActiveBatchValue {
  actions: BatchResultActions;
  request: string;
}

export interface BatchActionsObjectMap {
  [key: string]: BatchResultActions;
}

export interface BatchResultActions {
  reject: (reason: Error | Error[]) => void;
  resolve: (value: RequestExecutorResolveResult) => void;
}

export interface FetchManagerFetchResult {
  headers: Headers;
  result: any;
}
