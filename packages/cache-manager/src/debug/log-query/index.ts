import { debugDefs } from "@handl/debug-manager";
import { CACHE_ENTRY_QUERIED } from "../../consts";

export default function logQuery(debugManager?: debugDefs.DebugManager) {
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
          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          debugManager.emit(CACHE_ENTRY_QUERIED, {
            cacheType: args[0],
            context: args[3],
            options: args[2],
            request: args[1],
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
