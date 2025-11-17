import {
  OPERATION_EXECUTED,
  OPERATION_RESOLVED,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  type ResponseData,
} from '@graphql-box/core';
import { type Client } from '../main.ts';

type Descriptor = (
  requestData: OperationData,
  options: OperationOptions,
  context: OperationContext,
) => Promise<ResponseData>;

export const logOperation = () => {
  return (_target: Client, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise(resolve => {
        void (async () => {
          const { contextValue } = args[1];
          const { data, debugManager } = args[2];

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const startTime = debugManager.now();

          debugManager.log(OPERATION_EXECUTED, {
            data: {
              ...data,
              ...contextValue?.data,
            },
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          resolve(result);

          debugManager.log(OPERATION_RESOLVED, {
            data: {
              ...data,
              ...contextValue?.data,
            },
            stats: { duration, endTime, startTime },
          });
        })();
      });
    };
  };
};
