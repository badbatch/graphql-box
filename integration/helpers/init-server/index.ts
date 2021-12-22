import Cachemap from "@cachemap/core";
import cacheManager from "@graphql-box/cache-manager";
import Client from "@graphql-box/client";
import { DEFAULT_TYPE_ID_KEY } from "@graphql-box/core";
import debugManager from "@graphql-box/debug-manager";
import execute from "@graphql-box/execute";
import requestParser from "@graphql-box/request-parser";
import subscribe from "@graphql-box/subscribe";
import { schemaResolvers, schemaTypeDefs } from "@graphql-box/test-utils";
import { makeExecutableSchema } from "graphql-tools";
import { performance } from "perf_hooks";
import { InitServerOptions } from "../../defs";

const schema = makeExecutableSchema({ typeDefs: schemaTypeDefs, resolvers: schemaResolvers });

export default async function initServer({
  cachemapStore,
  debuggerName = "SERVER",
  typeCacheDirectives,
}: InitServerOptions): Promise<Client> {
  return Client.init({
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
      name: debuggerName,
      performance,
    }),
    requestManager: execute({ schema }),
    requestParser: requestParser({ schema }),
    subscriptionsManager: subscribe({ schema }),
    typeIDKey: DEFAULT_TYPE_ID_KEY,
  });
}
