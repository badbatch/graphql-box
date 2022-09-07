import Cachemap from "@cachemap/core";
import cacheManager from "@graphql-box/cache-manager";
import Client from "@graphql-box/client";
import { DEFAULT_TYPE_ID_KEY } from "@graphql-box/core";
import debugManager, { Environment } from "@graphql-box/debug-manager";
import FetchManager from "@graphql-box/fetch-manager";
import requestParser from "@graphql-box/request-parser";
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
    cacheManager: cacheManager({
      cache: new Cachemap({
        name: "cachemap",
        store: cachemapStore,
        type: "someType",
      }),
      cascadeCacheControl: true,
      typeCacheDirectives,
    }),
    debugManager: debugManager({
      environment: debuggerName.toLowerCase() as Environment,
      log,
      name: debuggerName,
      performance,
    }),
    requestManager: new FetchManager({ apiUrl: URL }),
    requestParser: requestParser({ introspection, schema }),
    subscriptionsManager,
    typeIDKey: DEFAULT_TYPE_ID_KEY,
  });
}
