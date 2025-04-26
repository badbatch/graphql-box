import { Core as Cachemap } from '@cachemap/core';
import { CoreWorker as WorkerCachemap } from '@cachemap/core-worker';
import { init as map } from '@cachemap/map';
import { camelCase } from 'lodash-es';
import { CacheManager } from '@graphql-box/cache-manager';
import { type GraphqlEnv } from '@graphql-box/core';
import { DebugManager } from '@graphql-box/debug-manager';
import { RequestParser } from '@graphql-box/request-parser';
import { WorkerClient } from '@graphql-box/worker-client';
import { type InitWorkerClientOptions } from '../types.ts';

const { performance } = globalThis;

export const initWorkerClient = ({ introspection, worker }: InitWorkerClientOptions) => {
  const name = 'WORKER_CLIENT';

  return new WorkerClient({
    cache: new WorkerCachemap({ name: 'test', type: 'someType', worker }),
    cacheManager: new CacheManager({
      cache: new Cachemap({
        name: 'workerClient',
        store: map(),
        type: 'someType',
      }),
      cacheTiersEnabled: {
        queryResponse: false,
      },
    }),
    debugManager: new DebugManager({
      // DebugManager is expecting Environment type, not string.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      environment: camelCase(name) as GraphqlEnv,
      name,
      performance,
    }),
    requestParser: new RequestParser({ introspection }),
    worker,
  });
};
