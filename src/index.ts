import { ClientArgs, RequestOptions, RequestResult } from "./types";
export type HandlArgs = ClientArgs;
export type HandleRequestOptions = RequestOptions;
export type HandleRequestResult = RequestResult;
export { DefaultClient as DefaultHandl } from "./default-client";
export { WorkerClient as WorkerHandl } from "./worker-client";
export { Client as Handl } from "./client";
