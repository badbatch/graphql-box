import { RequestContext } from "@graphql-box/core";
import { REQUEST_EXECUTED } from "../../consts";

export default function logRequest() {
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
          const { debugManager, ...otherContext } = args[2] as RequestContext;

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();
          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          debugManager.emit(REQUEST_EXECUTED, {
            context: otherContext,
            options: args[1],
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
