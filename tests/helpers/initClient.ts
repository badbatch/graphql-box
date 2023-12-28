import { Core as Cachemap } from '@cachemap/core';
import { URL } from '../constants.ts';
import { type InitClientOptions } from '../types.ts';
import { log } from './log.ts';
import { CacheManager } from '@graphql-box/cache-manager';
import { Client } from '@graphql-box/client';
import { DebugManager, type Environment } from '@graphql-box/debug-manager';
import { FetchManager } from '@graphql-box/fetch-manager';
import { RequestParser } from '@graphql-box/request-parser';

const { performance } = self;

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
