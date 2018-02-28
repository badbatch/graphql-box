import { ClientArgs, RequestOptions, RequestResult } from "./types";
export type HandlClientArgs = ClientArgs;
export type HandleClientRequestOptions = RequestOptions;
export type HandleClientRequestResult = RequestResult;
export { DefaultClient as DefaultHandl } from "./default-client";
export { WorkerClient as WorkerHandl } from "./worker-client";
export { Client as Handl } from "./client";
