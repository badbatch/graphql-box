import {
  OPERATION_EXECUTED,
  OPERATION_RESOLVED,
  type OperationContext,
  type OperationData,
  type OperationOptions,
  type ResponseData,
} from '@graphql-box/core';
import { operationNameRegex } from '../helpers/operationNameRegex.ts';
import { type WorkerClient } from '../main.ts';

type Descriptor = (
  operationData: OperationData,
  options: OperationOptions,
  context: OperationContext,
) => Promise<ResponseData>;

export const logOperation = () => {
  return (_target: WorkerClient, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = async function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      return new Promise(resolve => {
        void (async () => {
          const { data, debugManager } = args[2];

          if (!debugManager) {
            resolve(await method.apply(this, args));
            return;
          }

          const derivedOperationName = operationNameRegex(args[0].operation);
          const startTime = debugManager.now();

          debugManager.log(OPERATION_EXECUTED, {
            data: {
              ...data,
              ...(!data.operationName && derivedOperationName ? { operationName: derivedOperationName } : undefined),
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
              ...(!data.operationName && derivedOperationName ? { operationName: derivedOperationName } : undefined),
            },
            stats: { duration, endTime, startTime },
          });
        })();
      });
    };
  };
};
