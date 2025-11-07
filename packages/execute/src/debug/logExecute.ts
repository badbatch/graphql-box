import {
  EXECUTE_EXECUTED,
  EXECUTE_RESOLVED,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  type RequestManagerDef,
  type ResponseData,
} from '@graphql-box/core';

type Descriptor = (
  requestData: OperationData,
  options: OperationOptions,
  context: OperationContext,
) => Promise<ResponseData>;

export const logExecute = () => {
  return (_target: RequestManagerDef, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise<ResponseData>(resolve => {
        const resolver = async () => {
          const { data, debugManager } = args[2];

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.log(EXECUTE_EXECUTED, {
            data,
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          debugManager.log(EXECUTE_RESOLVED, {
            data,
            stats: { duration, endTime, startTime },
          });
        };

        void resolver();
      });
    };
  };
};
