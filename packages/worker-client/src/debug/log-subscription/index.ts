import { RequestContext, SUBSCRIPTION_EXECUTED } from "@graphql-box/core";

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
          const { debugManager, ...otherContext } = args[2] as RequestContext;

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.log(SUBSCRIPTION_EXECUTED, {
            context: otherContext,
            options: args[1],
            request: args[0],
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          resolve(result);
        });
      } catch (error) {
        return Promise.reject(error);
      }
    };
  };
}
