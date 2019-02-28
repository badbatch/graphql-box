import { RequestContext } from "@handl/core";
import { PARTIAL_QUERY_COMPILED } from "../../consts";

export default function logPartialCompiled() {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = async function (...args: any[]): Promise<any> {
      return new Promise(async (resolve) => {
        const { debugManager, ...otherContext } = args[3] as RequestContext;

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

        debugManager.emit(PARTIAL_QUERY_COMPILED, {
          context: otherContext,
          hash: args[0],
          options: args[2],
          partialQueryResponse: args[1],
          stats: { duration, endTime, startTime },
        });
      });
    };
  };
}
