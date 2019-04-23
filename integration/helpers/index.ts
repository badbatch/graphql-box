import Cachemap from "@cachemap/core";
import cacheManager from "@handl/cache-manager";
import Client from "@handl/client";
import { DEFAULT_TYPE_ID_KEY } from "@handl/core";
import debugManager from "@handl/debug-manager";
import fetchManager from "@handl/fetch-manager";
import requestParser from "@handl/request-parser";
import { githubIntrospection } from "@handl/test-utils";
import WorkerClient from "@handl/worker-client";
import fetchMock from "fetch-mock";
import { InitClientOptions, InitWorkerClientOptions, MockRequestOptions } from "../defs";

export const defaultOptions = { awaitDataCaching: true, returnCacheMetadata: true };

const { performance } = self;
const url = "https://api.github.com/graphql";

export function log(...args: any[]): void {
  console.log(...args); // tslint:disable-line:no-console
}

export async function initClient({
  cachemapStore,
  debuggerName = "CLIENT",
  typeCacheDirectives,
}: InitClientOptions): Promise<Client> {
  return Client.init({
    cacheManager: cacheManager({
      cache: await Cachemap.init({
        name: "cachemap",
        store: cachemapStore,
      }),
      cascadeCacheControl: true,
      typeCacheDirectives,
    }),
    debugManager: debugManager({
      logger: { log },
      name: debuggerName,
      performance,
    }),
    requestManager: fetchManager({ url }),
    requestParser: requestParser({ introspection: githubIntrospection }),
    typeIDKey: DEFAULT_TYPE_ID_KEY,
  });
}

export async function initWorkerClient({ worker }: InitWorkerClientOptions): Promise<WorkerClient> {
  return WorkerClient.init({
    debugManager: debugManager({
      logger: { log },
      name: "WORKER_CLIENT",
      performance,
    }),
    worker,
  });
}

function buildRequestURL(hash?: string): string {
  if (!hash) return "*";
  return `${url}?requestId=${hash}`;
}

export function mockRequest({ data, hash }: MockRequestOptions): void {
  const body = { data };
  const headers = { "cache-control": "public, max-age=5" };
  fetchMock.post(buildRequestURL(hash), { body, headers });
}
