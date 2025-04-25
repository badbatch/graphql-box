import { Core as Cachemap } from '@cachemap/core';
import { CacheManager } from '@graphql-box/cache-manager';
import { Client } from '@graphql-box/client';
import { type GraphqlEnv } from '@graphql-box/core';
import { DebugManager } from '@graphql-box/debug-manager';
import { FetchManager } from '@graphql-box/fetch-manager';
import { RequestParser } from '@graphql-box/request-parser';
import { URL } from '../constants.ts';
import { type InitClientOptions } from '../types.ts';
import { log } from './log.ts';

const { performance } = globalThis;

export const initClient = ({
  cachemapStore,
  debuggerName = 'CLIENT',
  introspection,
  schema,
  subscriptionsManager,
  typeCacheDirectives,
}: InitClientOptions) =>
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
      log,
      name: debuggerName,
      performance,
    }),
    requestManager: new FetchManager({ apiUrl: URL }),
    requestParser: new RequestParser({ introspection, schema }),
    subscriptionsManager,
  });
