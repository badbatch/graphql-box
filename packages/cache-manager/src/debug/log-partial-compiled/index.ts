import { PARTIAL_QUERY_COMPILED, RequestContext } from "@graphql-box/core";

export default function logPartialCompiled() {
  return (
    _target: any,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = async function descriptorValue(...args: any[]): Promise<any> {
      return new Promise<void>(async resolve => {
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

        debugManager.log(PARTIAL_QUERY_COMPILED, {
          context: otherContext,
          options: args[2],
          requestHash: args[0],
          result: args[1],
          stats: { duration, endTime, startTime },
        });
      });
    };
  };
}
