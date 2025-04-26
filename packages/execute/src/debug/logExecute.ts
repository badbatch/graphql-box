import {
  EXECUTE_EXECUTED,
  EXECUTE_RESOLVED,
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
  executeResolver: RequestResolver,
) => Promise<AsyncIterableIterator<PartialRequestResult | undefined> | PartialRawResponseData>;

export const logExecute = () => {
  return (_target: RequestManagerDef, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise<AsyncIterableIterator<PartialRequestResult | undefined> | PartialRawResponseData>(resolve => {
        const resolver = async () => {
          const { data, debugManager } = args[2];

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.log(EXECUTE_EXECUTED, {
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

          debugManager.log(EXECUTE_RESOLVED, {
            data,
            stats: { duration, endTime, startTime },
          });
        };

        void resolver();
      });
    };
  };
};
