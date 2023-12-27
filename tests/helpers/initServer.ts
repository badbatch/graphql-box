import { Core as Cachemap } from '@cachemap/core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { performance } from 'node:perf_hooks';
import { type InitServerOptions } from '../types.ts';
import { CacheManager } from '@graphql-box/cache-manager';
import { Client } from '@graphql-box/client';
import { DebugManager, type Environment } from '@graphql-box/debug-manager';
import { Execute } from '@graphql-box/execute';
import { RequestParser } from '@graphql-box/request-parser';
import { Subscribe } from '@graphql-box/subscribe';
import { resolvers, typeDefs } from '@graphql-box/test-utils';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
  updateResolversInPlace: true,
});

export const initServer = ({ cachemapStore, debuggerName = 'SERVER', typeCacheDirectives }: InitServerOptions) =>
  new Client({
    cacheManager: new CacheManager({
      cache: new Cachemap({
        name: 'cachemap',
        store: cachemapStore,
        type: 'someType',
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
