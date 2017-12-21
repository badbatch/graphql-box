import { isPlainObject } from "lodash";
import Client from "./client";
import { ClientArgs, RequestOptions, RequestResult } from "./types";
import WorkerClient from "./worker-client";

declare global {
  interface Window {
      Worker: Worker;
  }
}

export type Handl = Client | WorkerClient;
export type HandlArgs = ClientArgs;
export type HandleRequestOptions = RequestOptions;
export type HandleRequestResult = RequestResult;

export default async function createHandl(args: HandlArgs): Promise<Handl> {
  if (!isPlainObject(args)) {
    throw new TypeError("createHandl expected args to ba a plain object.");
  }

  let client: Handl;

  if (process.env.WEB_ENV) {
    if (window.Worker && window.indexedDB) {
      client = await WorkerClient.create(args);
    } else {
      client = await Client.create(args);
    }
  } else {
    client = await Client.create(args);
  }

  return client;
}
