import { CACHE_ENTRY_ADDED, type CacheTypes, type CachemapOptions, type RequestOptions } from '@graphql-box/core';
import type { CacheManagerContext, CacheManagerDef } from '../types.ts';

type Descriptor = (
  cacheType: CacheTypes,
  hash: string,
  value: unknown,
  cachemapOptions: CachemapOptions,
  options: RequestOptions,
  context: CacheManagerContext & { requestFieldCacheKey?: string }
) => Promise<void>;

export const logCacheEntry = () => {
  return (_target: CacheManagerDef, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise<void>(resolve => {
        void (async () => {
          const { debugManager, requestFieldCacheKey, ...otherContext } = args[5];

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

          const payload = {
            cacheType: args[0],
            cachemapOptions: args[3],
            context: otherContext,
            options: args[4],
            requestHash: args[1],
            stats: { duration, endTime, startTime },
            value: args[2],
            ...(requestFieldCacheKey ? { decryptedCacheKey: requestFieldCacheKey } : {}),
          };

          debugManager.log(CACHE_ENTRY_ADDED, payload);
        })();
      });
    };
  };
};
