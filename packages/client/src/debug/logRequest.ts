import {
  type PartialRequestResult,
  REQUEST_EXECUTED,
  REQUEST_RESOLVED,
  type RequestContext,
  type RequestData,
  type RequestOptions,
} from '@graphql-box/core';
import { isAsyncIterable } from 'iterall';
import { type Client } from '../main.ts';

type Descriptor = (
  requestData: RequestData,
  options: RequestOptions,
  context: RequestContext
) => Promise<PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>>;

export const logRequest = () => {
  return (_target: Client, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise(resolve => {
        void (async () => {
          const { hash } = args[0];
          const { debugManager, ...otherContext } = args[2];

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.log(REQUEST_EXECUTED, {
            context: otherContext,
            options: args[1],
            requestHash: hash,
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
            context: otherContext,
            options: args[1],
            requestHash: hash,
            result,
            stats: { duration, endTime, startTime },
          });
        })();
      });
    };
  };
};
