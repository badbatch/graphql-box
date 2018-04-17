import {
  CACHE_ENTRY_ADDED,
  FETCH_EXECUTED,
  PARTIAL_COMPILED,
  REQUEST_EXECUTED,
  SUBSCRIPTION_EXECUTED,
} from "../constants/events";

import clientHandlDebugger from "../debuggers/client-handl";

export function logCacheEntry(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>,
): void {
  const method = descriptor.value;
  if (!method) return;

  descriptor.value = async function (...args: any[]): Promise<void> {
    try {
      await method.apply(this, args);

      (async () => {
        const { cacheHeaders = {}, tag = null } = args[2];
        const { cache, handlID, operation, operationName } = args[3];

        clientHandlDebugger.emit(CACHE_ENTRY_ADDED, {
          cache,
          cacheHeaders,
          handlID,
          key: args[0],
          operation,
          operationName,
          tag,
          value: args[1],
        });
      })();
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export function logFetch(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
): void {
  const method = descriptor.value;
  if (!method) return;

  descriptor.value = async function (...args: any[]): Promise<any> {
    try {
      return new Promise(async (resolve) => {
        const result = await method.apply(this, args);
        resolve(result);
        const { handlID, operation, operationName } = args[3];

        clientHandlDebugger.emit(FETCH_EXECUTED, {
          handlID,
          operation,
          operationName,
          opts: args[2],
          request: args[0],
          result,
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export function logPartial(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => void>,
): void {
  const method = descriptor.value;
  if (!method) return;

  descriptor.value = function (...args: any[]): void {
    method.apply(this, args);

    (async () => {
      const { handlID, operation, operationName } = args[2];

      clientHandlDebugger.emit(PARTIAL_COMPILED, {
        handlID,
        operation,
        operationName,
        partial: args[1],
      });
    })();
  };
}

export function logRequest(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
): void {
  const method = descriptor.value;
  if (!method) return;

  descriptor.value = async function (...args: any[]): Promise<any> {
    try {
      return new Promise(async (resolve) => {
        const result = await method.apply(this, args);
        resolve(result);
        const { handlID, operation, operationName } = args[2];

        clientHandlDebugger.emit(REQUEST_EXECUTED, {
          handlID,
          operation,
          operationName,
          opts: args[1],
          request: args[0],
          result,
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export function logSubscription(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
): void {
  const method = descriptor.value;
  if (!method) return;

  descriptor.value = async function (...args: any[]): Promise<any> {
    try {
      return new Promise(async (resolve) => {
        const result = await method.apply(this, args);
        resolve(result);
        const { handlID, operation, operationName } = args[3];

        clientHandlDebugger.emit(SUBSCRIPTION_EXECUTED, {
          handlID,
          operation,
          operationName,
          opts: args[2],
          result,
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
