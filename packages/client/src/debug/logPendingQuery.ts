import { PENDING_QUERY_ADDED } from '@graphql-box/core';
import { type Client } from '../main.ts';
import { type PendingQueryData } from '../types.ts';

type Descriptor = (requestHash: string, data: PendingQueryData) => void;

export const logPendingQuery = () => {
  return (_target: Client, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      const { context } = args[1];
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
