import WorkerCachemap from "@cachemap/core-worker";
import debugManager from "@graphql-box/debug-manager";
import WorkerClient from "@graphql-box/worker-client";
import { log } from "..";
import { InitWorkerClientOptions } from "../../defs";

const { performance } = self;

export default function initWorkerClient({ worker }: InitWorkerClientOptions): WorkerClient {
  return new WorkerClient({
    cache: new WorkerCachemap({ name: "test", type: "someType", worker }),
    debugManager: debugManager({
      logger: { log },
      name: "WORKER_CLIENT",
      performance,
    }),
    worker,
  });
}
