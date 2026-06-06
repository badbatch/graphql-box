import {
  OPERATION_EXECUTED,
  OPERATION_REJECTED,
  OPERATION_RESOLVED,
  type OperationContext,
  type OperationOptions,
  type ResponseData,
} from '@graphql-box/core';
import { isEmpty } from 'lodash-es';
import { operationNameRegex } from '../helpers/operationNameRegex.ts';
import { type WorkerClient } from '../main.ts';

type Descriptor = (operation: string, options: OperationOptions, context: OperationContext) => Promise<ResponseData>;

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

          const derivedOperationName = operationNameRegex(args[0]);
          const startTime = debugManager.now();

          const context = {
            ...data,
            ...(!data.operationName && derivedOperationName ? { operationName: derivedOperationName } : undefined),
          };

          debugManager.log(OPERATION_EXECUTED, {
            context,
            stats: { startTime },
          });

          const result = await method.apply(this, args);
          const endTime = debugManager.now();
          const duration = endTime - startTime;
          const stats = { duration, endTime, startTime };
          resolve(result);

          if (result.data !== undefined && !isEmpty(result.data)) {
            debugManager.log(OPERATION_REJECTED, {
              context,
              stats,
            });
          } else {
            debugManager.log(OPERATION_RESOLVED, {
              context,
              data: result.data,
              stats,
            });
          }
        })();
      });
    };
  };
};
