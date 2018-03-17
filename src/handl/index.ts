import { isPlainObject } from "lodash";
import { ClientHandl } from "../client-handl";
import { supportsWorkerIndexedDB } from "../helpers/user-agent-parser";
import { ClientArgs } from "../types";
import { WorkerHandl } from "../worker-handl";

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

export class Handl {
  public static async create(args: ClientArgs): Promise<ClientHandl | WorkerHandl> {
    if (!isPlainObject(args)) {
      throw new TypeError("createHandl expected args to ba a plain object.");
    }

    let client: ClientHandl | WorkerHandl;

    try {
      if (process.env.WEB_ENV) {
        if (self.Worker && supportsWorkerIndexedDB(self.navigator.userAgent)) {
          client = await WorkerHandl.create(args);
        } else {
          client = await ClientHandl.create(args);
        }
      } else {
        client = await ClientHandl.create(args);
      }
    } catch (error) {
      return Promise.reject(error);
    }

    return client;
  }
}
