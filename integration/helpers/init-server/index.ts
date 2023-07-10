import Cachemap from "@cachemap/core";
import CacheManager from "@graphql-box/cache-manager";
import Client from "@graphql-box/client";
import DebugManager, { Environment } from "@graphql-box/debug-manager";
import Execute from "@graphql-box/execute";
import RequestParser from "@graphql-box/request-parser";
import Subscribe from "@graphql-box/subscribe";
import { schemaResolvers, schemaTypeDefs } from "@graphql-box/test-utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { performance } from "perf_hooks";
import { InitServerOptions } from "../../defs";

const schema = makeExecutableSchema({
  resolvers: schemaResolvers,
  typeDefs: schemaTypeDefs,
  updateResolversInPlace: true,
});

export default function initServer({ cachemapStore, debuggerName = "SERVER", typeCacheDirectives }: InitServerOptions) {
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
      name: debuggerName,
      performance,
    }),
    requestManager: new Execute({ schema }),
    requestParser: new RequestParser({ schema }),
    subscriptionsManager: new Subscribe({ schema }),
  });
}
