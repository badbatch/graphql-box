import logger from "../logger";

let performance: Performance;

if (process.env.WEB_ENV) {
  performance = self.performance;
} else {
  performance = require("perf_hooks").performance; // tslint:disable-line
}

export function timeAsyncMethod(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
): void {
  const method = descriptor.value;
  if (!method) return;

  descriptor.value = async function (...args: any[]): Promise<any> {
    try {
      const startTime = performance.now();
      const result = await method.apply(this, args);
      const message = `${propertyName} method => timed at ${(performance.now() - startTime).toFixed(2)}ms`;
      logger.debug(message, { query: args[0] });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
