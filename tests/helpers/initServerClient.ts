import { Core as Cachemap } from '@cachemap/core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { performance } from 'node:perf_hooks';
import { CacheManager } from '@graphql-box/cache-manager';
import { Client } from '@graphql-box/client';
import { type GraphqlEnv } from '@graphql-box/core';
import { DebugManager } from '@graphql-box/debug-manager';
import { Execute } from '@graphql-box/execute';
import { RequestParser } from '@graphql-box/request-parser';
import { Subscribe } from '@graphql-box/subscribe';
import { resolvers, typeDefs } from '@graphql-box/test-utils';
import { type InitServerOptions } from '../types.ts';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
  updateResolversInPlace: true,
});

export const initServerClient = ({ cachemapStore, debuggerName = 'SERVER', typeCacheDirectives }: InitServerOptions) =>
  new Client({
    cacheManager: new CacheManager({
      cache: new Cachemap({
        name: 'cachemap',
        store: cachemapStore,
        type: 'someType',
      }),
      cacheTiersEnabled: {
        entity: true,
        queryResponse: true,
        requestPath: true,
      },
      cascadeCacheControl: true,
      typeCacheDirectives,
    }),
    debugManager: new DebugManager({
      // DebugManager is expecting Environment type, not string.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      environment: debuggerName.toLowerCase() as GraphqlEnv,
      name: debuggerName,
      performance,
    }),
    requestManager: new Execute({ schema }),
    requestParser: new RequestParser({ schema }),
    subscriptionsManager: new Subscribe({ schema }),
  });
