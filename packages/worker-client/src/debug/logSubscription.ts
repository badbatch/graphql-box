import {
  type PartialRequestResult,
  type RequestContext,
  type RequestOptions,
  SUBSCRIPTION_EXECUTED,
} from '@graphql-box/core';
import { operationNameRegex } from '../helpers/operationNameRegex.ts';
import { type WorkerClient } from '../main.ts';

type Descriptor = (
  request: string,
  options: RequestOptions,
  context: RequestContext,
) => Promise<PartialRequestResult | AsyncIterableIterator<PartialRequestResult | undefined>>;

export const logSubscription = () => {
  return (_target: WorkerClient, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise(resolve => {
        void (async () => {
          const { debugManager, ...otherContext } = args[2];

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const derivedOperationName = operationNameRegex(args[0]);
          const startTime = debugManager.now();

          debugManager.log(SUBSCRIPTION_EXECUTED, {
            context: { ...otherContext, operationName: derivedOperationName },
            options: args[1],
            request: args[0],
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          resolve(result);
        })();
      });
    };
  };
};
