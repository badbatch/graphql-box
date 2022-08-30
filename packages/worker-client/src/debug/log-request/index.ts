import { REQUEST_EXECUTED, REQUEST_RESOLVED, RequestContext } from "@graphql-box/core";
import { isAsyncIterable } from "iterall";

export default function logRequest() {
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
          const { debugManager, ...otherContext } = args[2] as RequestContext;

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.log(REQUEST_EXECUTED, {
            context: otherContext,
            options: args[1],
            request: args[0],
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          if (isAsyncIterable(result)) {
            return;
          }

          debugManager.log(REQUEST_RESOLVED, {
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
