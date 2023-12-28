import {
  FETCH_EXECUTED,
  FETCH_RESOLVED,
  type PartialRawResponseData,
  type PartialRequestResult,
  type RequestContext,
  type RequestData,
  type RequestManagerDef,
  type RequestResolver,
  type ServerRequestOptions,
} from '@graphql-box/core';
import { isAsyncIterable } from 'iterall';

type Descriptor = (
  requestData: RequestData,
  options: ServerRequestOptions,
  context: RequestContext,
  executeResolver: RequestResolver
) => Promise<AsyncIterableIterator<PartialRequestResult | undefined> | PartialRawResponseData>;

export const logFetch = () => {
  return (_target: RequestManagerDef, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;
    if (!method) return;

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

          debugManager.log(FETCH_EXECUTED, {
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

          const { headers, ...otherResult } = result;

          debugManager.log(FETCH_RESOLVED, {
            context: otherContext,
            options: args[1],
            requestHash: hash,
            result: otherResult,
            stats: { duration, endTime, startTime },
          });
        })();
      });
    };
  };
};
