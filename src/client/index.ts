import { isPlainObject } from "lodash";
import { DefaultClient } from "../default-client";
import { supportsWorkerIndexedDB } from "../helpers/user-agent-parser";
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

    try {
      if (process.env.WEB_ENV) {
        if (self.Worker && supportsWorkerIndexedDB(self.navigator.userAgent)) {
          client = await WorkerClient.create(args);
        } else {
          client = await DefaultClient.create(args);
        }
      } else {
        client = await DefaultClient.create(args);
      }
    } catch (error) {
      return Promise.reject(error);
    }

    return client;
  }
}
