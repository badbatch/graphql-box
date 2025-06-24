import {
  type PartialRequestResult,
  REQUEST_EXECUTED,
  REQUEST_RESOLVED,
  type RequestContext,
  type RequestData,
  type RequestOptions,
  type ServerRequestOptions,
} from '@graphql-box/core';
import { isAsyncIterable } from 'iterall';
import { type Client } from '../main.ts';

type Descriptor = (
  requestData: RequestData,
  options: RequestOptions,
  context: RequestContext,
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
          // @ts-expect-error This can be ServerRequestOptions, which does have
          // contextValue. Need to update options type to include server options.
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          const { contextValue } = args[1] as RequestOptions | ServerRequestOptions;
          const { data, debugManager } = args[2];

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.log(REQUEST_EXECUTED, {
            // See comment above.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: {
              ...data,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ...contextValue?.data,
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
            // See comment above.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: {
              ...data,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ...contextValue?.data,
            },
            stats: { duration, endTime, startTime },
          });
        })();
      });
    };
  };
};
