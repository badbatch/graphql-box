import { RequestContext, RequestData, SUBSCRIPTION_EXECUTED, SUBSCRIPTION_RESOLVED } from "@graphql-box/core";

export default function logSubscription() {
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
          const { ast, ...rest } = args[0] as RequestData;
          const { debugManager, requestID, ...otherContext } = args[3] as RequestContext;

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.emit(SUBSCRIPTION_EXECUTED, {
            context: otherContext,
            options: args[2],
            rawResponseData: args[1],
            requestData: rest,
            requestID,
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          debugManager.emit(SUBSCRIPTION_RESOLVED, {
            context: otherContext,
            options: args[2],
            rawResponseData: args[1],
            requestData: rest,
            requestID,
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
