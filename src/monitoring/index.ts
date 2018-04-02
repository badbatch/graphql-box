import logger from "../logger";

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
        const message = `Request ${handlID} => ${cache} cache entry logged`;

        logger.debug(message, {
          cache,
          cacheHeaders,
          handlID,
          key: args[0],
          operation, tag,
          type: "log_cache_entry",
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
        const message = `Request ${handlID} => fetch logged`;

        logger.debug(message, {
          handlID,
          operation,
          opts: args[2],
          request: args[0],
          result,
          type: "log_fetch",
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
      const message = `Request ${handlID} => partial logged`;

      logger.debug(message, {
        handlID,
        operation,
        partial: args[1],
        type: "log_partial",
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
        const message = `Request ${handlID} => logged`;

        logger.debug(message, {
          handlID,
          operation,
          opts: args[1],
          request: args[0],
          result,
          type: "log_request",
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
        const message = `Request ${handlID} => subscription logged`;

        logger.debug(message, {
          handlID,
          operation,
          opts: args[2],
          result,
          type: "log_subscription",
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
