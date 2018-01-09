import { isPlainObject } from "lodash";
import { DefaultClient } from "../default-client";
import { ClientArgs } from "../types";
import { WorkerClient } from "../worker-client";

declare global {
  interface Window {
    WebSocket: WebSocket;
    Worker: Worker;
  }
  interface WorkerGlobalScope {
    WebSocket: WebSocket;
    Worker: Worker;
  }
}

export class Client {
  public static async create(args: ClientArgs): Promise<DefaultClient | WorkerClient> {
    if (!isPlainObject(args)) {
      throw new TypeError("createHandl expected args to ba a plain object.");
    }

    let client: DefaultClient | WorkerClient;

    if (process.env.WEB_ENV) {
      if (self.Worker && self.indexedDB) {
        client = await WorkerClient.create(args);
      } else {
        client = await DefaultClient.create(args);
      }
    } else {
      client = await DefaultClient.create(args);
    }

    return client;
  }
}
