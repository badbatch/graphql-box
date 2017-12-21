declare module "promise-worker" {
  export default class PromiseWorker {
    constructor(worker: Worker);
    public postMessage(message: any): Promise<any>;
  }
}

declare module "promise-worker/register" {
  export default function registerPromiseWorker(callback: (message: any) => any): void;
}
