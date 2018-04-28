import { ServerArgs, ServerRequestOptions } from "./server-handl/types";

import {
  ClientArgs,
  RequestOptions,
  RequestResult,
  RequestResultData,
} from "./types";

export type HandlClientArgs = ClientArgs;
export type HandlClientRequestOptions = RequestOptions;
export type HandlClientRequestResult = RequestResult;
export type HandlClientRequestResultData = RequestResultData;
export type HandlServerArgs = ServerArgs;
export type HandlServerRequestOptions = ServerRequestOptions;
export { ClientHandl } from "./client-handl";
export { ServerHandl } from "./server-handl";
export { WorkerHandl } from "./worker-handl";
export { Handl } from "./handl";
export { MetadataType } from "./metadata-type";

export {
  CACHE_ENTRY_ADDED,
  CACHE_ENTRY_QUERIED,
  FETCH_EXECUTED,
  PARTIAL_COMPILED,
  REQUEST_EXECUTED,
  SUBSCRIPTION_EXECUTED,
} from "./constants/events";
