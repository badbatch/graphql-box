import {
  type PartialRequestResult,
  REQUEST_EXECUTED,
  REQUEST_RESOLVED,
  type RequestContext,
  type RequestOptions,
} from '@graphql-box/core';
import { isAsyncIterable } from 'iterall';
import { operationNameRegex } from '../helpers/operationNameRegex.ts';
import { type WorkerClient } from '../main.ts';

type Descriptor = (
  request: string,
  options: RequestOptions,
  context: RequestContext,
) => Promise<PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>>;

export const logRequest = () => {
  return (_target: WorkerClient, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise(resolve => {
        void (async () => {
          const { data, debugManager } = args[2];

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const derivedOperationName = operationNameRegex(args[0]);
          const startTime = debugManager.now();

          debugManager.log(REQUEST_EXECUTED, {
            data: {
              ...data,
              ...(!data.operationName && derivedOperationName ? { operationName: derivedOperationName } : undefined),
            },
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          if (isAsyncIterable(result)) {
            return;
          }

          debugManager.log(REQUEST_RESOLVED, {
            data: {
              ...data,
              ...(!data.operationName && derivedOperationName ? { operationName: derivedOperationName } : undefined),
            },
            stats: { duration, endTime, startTime },
          });
        })();
      });
    };
  };
};
