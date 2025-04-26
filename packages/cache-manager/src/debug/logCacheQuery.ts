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
          const { data, debugManager, requestFieldCacheKey } = args[3];

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

          debugManager.log(CACHE_ENTRY_QUERIED, {
            data: {
              ...data,
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
