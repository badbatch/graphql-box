import { PENDING_QUERY_ADDED } from '@graphql-box/core';
import { type OperationParams } from '@graphql-box/core';
import { type Client } from '../main.ts';
import { type PendingQueryResolver } from '../types.ts';

type Descriptor = (activeQuery: OperationParams, resolver: PendingQueryResolver) => void;

export const logPendingQuery = () => {
  return (_target: Client, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      const { context } = args[0];
      const { data, debugManager } = context;

      if (!debugManager) {
        method.apply(this, args);
        return;
      }

      method.apply(this, args);

      debugManager.log(PENDING_QUERY_ADDED, {
        data,
      });
    };
  };
};
