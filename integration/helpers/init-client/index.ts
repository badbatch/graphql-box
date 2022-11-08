import Cachemap from "@cachemap/core";
import CacheManager from "@graphql-box/cache-manager";
import Client from "@graphql-box/client";
import DebugManager, { Environment } from "@graphql-box/debug-manager";
import FetchManager from "@graphql-box/fetch-manager";
import RequestParser from "@graphql-box/request-parser";
import { log } from "..";
import { URL } from "../../consts";
import { InitClientOptions } from "../../defs";

const { performance } = self;

export default function initClient({
  cachemapStore,
  debuggerName = "CLIENT",
  introspection,
  schema,
  subscriptionsManager,
  typeCacheDirectives,
}: InitClientOptions): Client {
  return new Client({
    cacheManager: new CacheManager({
      cache: new Cachemap({
        name: "cachemap",
        store: cachemapStore,
        type: "someType",
      }),
      cascadeCacheControl: true,
      typeCacheDirectives,
    }),
    debugManager: new DebugManager({
      environment: debuggerName.toLowerCase() as Environment,
      log,
      name: debuggerName,
      performance,
    }),
    requestManager: new FetchManager({ apiUrl: URL }),
    requestParser: new RequestParser({ introspection, schema }),
    subscriptionsManager,
  });
}
