import {
  type PartialRequestResult,
  type RequestContext,
  type RequestData,
  type RequestOptions,
  SUBSCRIPTION_EXECUTED,
  SUBSCRIPTION_RESOLVED,
} from '@graphql-box/core';
import { isAsyncIterable } from 'iterall';
import { type Client } from '../main.ts';

type Descriptor = (
  requestData: RequestData,
  options: RequestOptions,
  context: RequestContext,
) => Promise<PartialRequestResult | AsyncIterator<PartialRequestResult | undefined>>;

export const logSubscription = () => {
  return (_target: Client, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
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

          const startTime = debugManager.now();

          debugManager.log(SUBSCRIPTION_EXECUTED, {
            data,
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          if (isAsyncIterable(result)) {
            return;
          }

          debugManager.log(SUBSCRIPTION_RESOLVED, {
            data,
            stats: { duration, endTime, startTime },
          });
        })();
      });
    };
  };
};
