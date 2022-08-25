import WorkerCachemap from "@cachemap/core-worker";
import debugManager, { DebugManagerLocation } from "@graphql-box/debug-manager";
import WorkerClient from "@graphql-box/worker-client";
import { camelCase } from "lodash";
import { log } from "..";
import { InitWorkerClientOptions } from "../../defs";

const { performance } = self;

export default function initWorkerClient({ worker }: InitWorkerClientOptions): WorkerClient {
  const name = "WORKER_CLIENT";

  return new WorkerClient({
    cache: new WorkerCachemap({ name: "test", type: "someType", worker }),
    debugManager: debugManager({
      location: camelCase(name) as DebugManagerLocation,
      logger: { log },
      name,
      performance,
    }),
    worker,
  });
}
