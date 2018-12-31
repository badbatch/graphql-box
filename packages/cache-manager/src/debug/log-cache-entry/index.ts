import { debugDefs } from "@handl/debug-manager";
import { CACHE_ENTRY_ADDED } from "../../consts";

export default function logCacheEntry(debugManager?: debugDefs.DebugManager) {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ): void => {
    const method = descriptor.value;
    if (!method || !debugManager) return;

    descriptor.value = async function (...args: any[]): Promise<any> {
      try {
        return new Promise(async (resolve) => {
          const startTime = debugManager.now();
          await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve();

          debugManager.emit(CACHE_ENTRY_ADDED, {
            cachemapOptions: args[3],
            cacheType: args[0],
            context: args[5],
            hash: args[1],
            options: args[4],
            stats: { duration, endTime, startTime },
            value: args[2],
          });
        });
      } catch (error) {
        return Promise.reject(error);
      }
    };
  };
}
