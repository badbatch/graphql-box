import { REQUEST_TIMED } from "../constants/events";
import clientHandlDebugger from "../debuggers/client-handl";

let performance: Performance;

if (process.env.WEB_ENV) {
  performance = self.performance;
} else {
  performance = require("perf_hooks").performance; // tslint:disable-line
}

export function timeRequest(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
): void {
  const method = descriptor.value;
  if (!method) return;

  descriptor.value = async function (...args: any[]): Promise<any> {
    try {
      return new Promise(async (resolve) => {
        const startTime = performance.now();
        const result = await method.apply(this, args);
        const endTime = performance.now();
        resolve(result);
        const duration = endTime - startTime;
        const { handlID, operation, operationName } = args[2];

        clientHandlDebugger.emit(REQUEST_TIMED, {
          duration,
          endTime,
          handlID,
          operation,
          operationName,
          startTime,
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
