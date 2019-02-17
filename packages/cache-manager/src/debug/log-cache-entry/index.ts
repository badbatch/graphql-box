import { RequestContext } from "@handl/core";
import { CACHE_ENTRY_ADDED } from "../../consts";

export default function logCacheEntry() {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = async function (...args: any[]): Promise<any> {
      return new Promise(async (resolve) => {
        const { debugManager, ...otherContext } = args[5] as RequestContext;

        if (!debugManager) {
          method.apply(this, args);
          resolve();
          return;
        }

        const startTime = debugManager.now();
        await method.apply(this, args);
        const endTime = debugManager.now();
        const duration = endTime - startTime;
        resolve();

        debugManager.emit(CACHE_ENTRY_ADDED, {
          cachemapOptions: args[3],
          cacheType: args[0],
          context: otherContext,
          hash: args[1],
          options: args[4],
          stats: { duration, endTime, startTime },
          value: args[2],
        });
      });
    };
  };
}
