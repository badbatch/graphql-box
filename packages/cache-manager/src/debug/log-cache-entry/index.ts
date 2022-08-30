import { CACHE_ENTRY_ADDED, RequestContext } from "@graphql-box/core";

export default function logCacheEntry() {
  return (
    _target: any,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = async function descriptorValue(...args: any[]): Promise<any> {
      return new Promise<void>(async resolve => {
        const { debugManager, requestFieldCacheKey, ...otherContext } = args[5] as RequestContext & {
          requestFieldCacheKey?: string;
        };

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
          cachemapOptions: args[3],
          cacheType: args[0],
          context: otherContext,
          options: args[4],
          requestHash: args[1],
          stats: { duration, endTime, startTime },
          value: args[2],
          ...(requestFieldCacheKey ? { decryptedCacheKey: requestFieldCacheKey } : {}),
        };

        debugManager.log(CACHE_ENTRY_ADDED, payload);
      });
    };
  };
}
