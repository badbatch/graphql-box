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

/**
 * An isomorphic GraphQL client that works on the server, browser
 * and in a web worker.
 *
 */
export class Handl {
  /**
   * The method creates an instance of either ClientHandl for
   * the server, ClientHandl for the browser, or WorkerHandl,
   * based on whether the `WEB_ENV` environment variable is set to `true`
   * and whether the environment supports web workers.
   *
   */
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
