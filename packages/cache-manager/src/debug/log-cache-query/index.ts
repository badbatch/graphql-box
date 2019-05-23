import { RequestContext } from "@graphql-box/core";
import { CACHE_ENTRY_QUERIED } from "../../consts";

export default function logCacheQuery() {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = async function (...args: any[]): Promise<any> {
      try {
        return new Promise(async (resolve) => {
          const { debugManager, ...otherContext } = args[3] as RequestContext;

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();
          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          debugManager.emit(CACHE_ENTRY_QUERIED, {
            cacheType: args[0],
            context: otherContext,
            hash: args[1],
            options: args[2],
            result,
            stats: { duration, endTime, startTime },
          });
        });
      } catch (error) {
        return Promise.reject(error);
      }
    };
  };
}
