import { DebugManagerDef } from "@handl/debug-manager";
import { PARTIAL_QUERY_COMPILED } from "../../consts";

export default function logPartialCompiled(debugManager?: DebugManagerDef) {
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

          debugManager.emit(PARTIAL_QUERY_COMPILED, {
            context: args[3],
            hash: args[0],
            options: args[2],
            partialQueryResponse: args[1],
            stats: { duration, endTime, startTime },
          });
        });
      } catch (error) {
        return Promise.reject(error);
      }
    };
  };
}
