import { CACHE_ENTRY_ADDED, type CacheTypes, type CachemapOptions, type RequestOptions } from '@graphql-box/core';
import { type CacheManagerContext, type CacheManagerDef } from '../types.ts';

type Descriptor = (
  cacheType: CacheTypes,
  hash: string,
  value: unknown,
  cachemapOptions: CachemapOptions,
  options: RequestOptions,
  context: CacheManagerContext & { requestFieldCacheKey?: string },
) => Promise<void>;

export const logCacheEntry = () => {
  return (_target: CacheManagerDef, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise<void>(resolve => {
        const resolver = async () => {
          const { data, debugManager, requestFieldCacheKey } = args[5];

          if (!debugManager) {
            await method.apply(this, args);
            resolve();
            return;
          }

          const startTime = debugManager.now();
          await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve();

          debugManager.log(CACHE_ENTRY_ADDED, {
            data: {
              ...data,
              cacheHeaders: args[3].cacheHeaders,
              cacheType: args[0],
              ...(requestFieldCacheKey ? { decryptedCacheKey: requestFieldCacheKey } : undefined),
            },
            stats: { duration, endTime, startTime },
          });
        };

        void resolver();
      });
    };
  };
};
