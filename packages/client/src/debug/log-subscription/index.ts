import { debugDefs } from "@handl/debug-manager";
import { SUBSCRIPTION_EXECUTED } from "../../consts";

export default function logSubscription(debugManager?: debugDefs.DebugManager) {
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

          debugManager.emit(SUBSCRIPTION_EXECUTED, {
            context: args[3],
            options: args[2],
            rawResult: args[1],
            request: args[0],
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
