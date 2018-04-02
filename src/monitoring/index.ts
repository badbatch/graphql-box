import handlDebugger from "../debugger";

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
        const { cache, handlID, operation } = args[3];

        handlDebugger.emit("cache_entry_added", {
          cache,
          cacheHeaders,
          handlID,
          key: args[0],
          operation, tag,
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
        const { handlID, operation } = args[3];

        handlDebugger.emit("fetch_executed", {
          handlID,
          operation,
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
      const { handlID, operation } = args[2];

      handlDebugger.emit("partial_compiled", {
        handlID,
        operation,
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
        const { handlID, operation } = args[2];

        handlDebugger.emit("request_executed", {
          handlID,
          operation,
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
        const { handlID, operation } = args[3];

        handlDebugger.emit("subscription_executed", {
          handlID,
          operation,
          opts: args[2],
          result,
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
