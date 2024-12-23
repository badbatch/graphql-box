import { CoreWorker as WorkerCachemap } from '@cachemap/core-worker';
import { camelCase } from 'lodash-es';
import { DebugManager, type Environment } from '@graphql-box/debug-manager';
import { WorkerClient } from '@graphql-box/worker-client';
import { type InitWorkerClientOptions } from '../types.ts';
import { log } from './log.ts';

const { performance } = globalThis;

export const initWorkerClient = ({ worker }: InitWorkerClientOptions) => {
  const name = 'WORKER_CLIENT';

  return new WorkerClient({
    cache: new WorkerCachemap({ name: 'test', type: 'someType', worker }),
    debugManager: new DebugManager({
      // DebugManager is expecting Environment type, not string.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      environment: camelCase(name) as Environment,
      log,
      name,
      performance,
    }),
    worker,
  });
};
