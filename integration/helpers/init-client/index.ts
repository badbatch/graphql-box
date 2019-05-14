import Cachemap from "@cachemap/core";
import cacheManager from "@handl/cache-manager";
import Client from "@handl/client";
import { DEFAULT_TYPE_ID_KEY } from "@handl/core";
import debugManager from "@handl/debug-manager";
import fetchManager from "@handl/fetch-manager";
import requestParser from "@handl/request-parser";
import { log } from "..";
import { URL } from "../../consts";
import { InitClientOptions } from "../../defs";

const { performance } = self;

export default async function initClient({
  cachemapStore,
  debuggerName = "CLIENT",
  introspection,
  schema,
  subscriptionsManager,
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
    requestManager: fetchManager({ url: URL }),
    requestParser: requestParser({ introspection, schema }),
    subscriptionsManager,
    typeIDKey: DEFAULT_TYPE_ID_KEY,
  });
}
