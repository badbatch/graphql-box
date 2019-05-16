import Cachemap from "@cachemap/core";
import cacheManager from "@handl/cache-manager";
import Client from "@handl/client";
import { DEFAULT_TYPE_ID_KEY } from "@handl/core";
import debugManager from "@handl/debug-manager";
import execute from "@handl/execute";
import requestParser from "@handl/request-parser";
import subscribe from "@handl/subscribe";
import { schemaResolvers, schemaTypeDefs } from "@handl/test-utils";
import { makeExecutableSchema } from "graphql-tools";
import { performance } from "perf_hooks";
import { log } from "..";
import { InitServerOptions } from "../../defs";

const schema = makeExecutableSchema({ typeDefs: schemaTypeDefs, resolvers: schemaResolvers });

export default async function initServer({
  cachemapStore,
  debuggerName = "SERVER",
  typeCacheDirectives,
}: InitServerOptions): Promise<Client> {
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
    requestManager: execute({ schema }),
    requestParser: requestParser({ schema }),
    subscriptionsManager: subscribe({ schema }),
    typeIDKey: DEFAULT_TYPE_ID_KEY,
  });
}
