import Cachemap from "@cachemap/core";
import cacheManager from "@graphql-box/cache-manager";
import Client from "@graphql-box/client";
import { DEFAULT_TYPE_ID_KEY } from "@graphql-box/core";
import debugManager from "@graphql-box/debug-manager";
import fetchManager from "@graphql-box/fetch-manager";
import requestParser from "@graphql-box/request-parser";
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
      cache: new Cachemap({
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
