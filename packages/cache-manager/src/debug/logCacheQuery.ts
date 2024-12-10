import { CACHE_ENTRY_QUERIED, type CacheTypes, type RequestOptions } from '@graphql-box/core';
import { type CacheManagerContext, type CacheManagerDef } from '../types.ts';

type Descriptor = (
  cacheType: CacheTypes,
  hash: string,
  options: RequestOptions,
  context: CacheManagerContext & { requestFieldCacheKey?: string },
  // Proving more difficult to fix, that worth the effort
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
) => Promise<never | undefined>;

export const logCacheQuery = () => {
  return (_target: CacheManagerDef, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      // Proving more difficult to fix, that worth the effort
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
      return new Promise<never | undefined>(resolve => {
        const resolver = async () => {
          const { debugManager, requestFieldCacheKey, ...otherContext } = args[3];

          if (!debugManager) {
            // Proving more difficult to fix, that worth the effort
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();
          // Proving more difficult to fix, that worth the effort
          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          const payload = {
            cacheType: args[0],
            context: otherContext,
            options: args[2],
            requestHash: args[1],
            result,
            stats: { duration, endTime, startTime },
            ...(requestFieldCacheKey ? { decryptedCacheKey: requestFieldCacheKey } : {}),
          };

          debugManager.log(CACHE_ENTRY_QUERIED, payload);
        };

        void resolver();
      });
    };
  };
};
