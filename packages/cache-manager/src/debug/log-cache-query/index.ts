import { RequestContext } from "@graphql-box/core";
import { CACHE_ENTRY_QUERIED } from "../../consts";

export default function logCacheQuery() {
  return (
    _target: any,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = async function descriptorValue(...args: any[]): Promise<any> {
      try {
        return new Promise(async resolve => {
          const { debugManager, requestFieldCacheKey, ...otherContext } = args[3] as RequestContext & {
            requestFieldCacheKey?: string;
          };

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();
          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          const payload = {
            cacheType: args[0],
            context: otherContext,
            hash: args[1],
            options: args[2],
            result,
            stats: { duration, endTime, startTime },
            ...(requestFieldCacheKey ? { decryptedCacheKey: requestFieldCacheKey } : {}),
          };

          debugManager.emit(CACHE_ENTRY_QUERIED, payload);
        });
      } catch (error) {
        return Promise.reject(error);
      }
    };
  };
}
