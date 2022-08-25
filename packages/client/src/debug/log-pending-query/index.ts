import { PENDING_QUERY_ADDED } from "@graphql-box/core";
import { PendingQueryData } from "../../defs";

export default function logPendingQuery() {
  return (_target: any, _propertyName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => void>): void => {
    const method = descriptor.value;
    if (!method) return;

    descriptor.value = function descriptorValue(...args: any[]): void {
      try {
        const { context, options, requestData } = args[1] as PendingQueryData;
        const { hash } = requestData;
        const { debugManager, requestID, ...otherContext } = context;

        if (!debugManager) {
          return method.apply(this, args);
        }

        const result = method.apply(this, args);

        debugManager.emit(PENDING_QUERY_ADDED, {
          activeRequestHash: args[0],
          context: otherContext,
          options,
          pendingRequestHash: hash,
          requestID,
        });

        return result;
      } catch (error) {
        throw error;
      }
    };
  };
}
