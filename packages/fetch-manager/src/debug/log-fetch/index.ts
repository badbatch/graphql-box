import { FETCH_EXECUTED, FETCH_RESOLVED, RequestContext, RequestData } from "@graphql-box/core";
import { isAsyncIterable } from "iterall";

export default function logFetch() {
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
          const { hash } = args[0] as RequestData;
          const { debugManager, ...otherContext } = args[2] as RequestContext;

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.log(FETCH_EXECUTED, {
            context: otherContext,
            options: args[1],
            requestHash: hash,
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          if (isAsyncIterable(result)) {
            return;
          }

          const { headers, ...otherResult } = result;

          debugManager.log(FETCH_RESOLVED, {
            context: otherContext,
            options: args[1],
            requestHash: hash,
            result: otherResult,
            stats: { duration, endTime, startTime },
          });
        });
      } catch (error) {
        return Promise.reject(error);
      }
    };
  };
}
