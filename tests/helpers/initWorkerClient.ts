import { CoreWorker as WorkerCachemap } from '@cachemap/core-worker';
import { camelCase } from 'lodash-es';
import { type InitWorkerClientOptions } from '../types.ts';
import { log } from './log.ts';
import { DebugManager, type Environment } from '@graphql-box/debug-manager';
import { WorkerClient } from '@graphql-box/worker-client';

const { performance } = self;

export const initWorkerClient = ({ worker }: InitWorkerClientOptions) => {
  const name = 'WORKER_CLIENT';

  return new WorkerClient({
    cache: new WorkerCachemap({ name: 'test', type: 'someType', worker }),
    debugManager: new DebugManager({
      environment: camelCase(name) as Environment,
      log,
      name,
      performance,
    }),
    worker,
  });
};
