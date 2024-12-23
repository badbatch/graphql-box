import { PARTIAL_QUERY_COMPILED, type RequestOptions } from '@graphql-box/core';
import { type CacheManagerContext, type CacheManagerDef, type PartialQueryResponse } from '../types.ts';

type Descriptor = (
  hash: string,
  partialQueryResponse: PartialQueryResponse,
  options: RequestOptions,
  context: CacheManagerContext,
) => void;

export const logPartialCompiled = () => {
  return (_target: CacheManagerDef, _propertyName: string, descriptor: TypedPropertyDescriptor<Descriptor>): void => {
    const method = descriptor.value;

    if (!method) {
      return;
    }

    descriptor.value = function descriptorValue(...args: Parameters<Descriptor>): ReturnType<Descriptor> {
      const { debugManager, ...otherContext } = args[3];

      if (!debugManager) {
        method.apply(this, args);
        return;
      }

      const startTime = debugManager.now();
      method.apply(this, args);
      const endTime = debugManager.now();
      const duration = endTime - startTime;

      debugManager.log(PARTIAL_QUERY_COMPILED, {
        context: otherContext,
        options: args[2],
        requestHash: args[0],
        result: args[1],
        stats: { duration, endTime, startTime },
      });
    };
  };
};
