import { RequestContext } from "@graphql-box/core";
import { CACHE_ENTRY_ADDED } from "../../consts";

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
          hash: args[1],
          options: args[4],
          stats: { duration, endTime, startTime },
          value: args[2],
          ...(requestFieldCacheKey ? { decryptedCacheKey: requestFieldCacheKey } : {}),
        };

        debugManager.emit(CACHE_ENTRY_ADDED, payload);
      });
    };
  };
}
