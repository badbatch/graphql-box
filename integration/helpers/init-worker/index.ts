import WorkerCachemap from "@cachemap/core-worker";
import DebugManager, { Environment } from "@graphql-box/debug-manager";
import WorkerClient from "@graphql-box/worker-client";
import { camelCase } from "lodash";
import { log } from "..";
import { InitWorkerClientOptions } from "../../defs";

const { performance } = self;

export default function initWorkerClient({ worker }: InitWorkerClientOptions): WorkerClient {
  const name = "WORKER_CLIENT";

  return new WorkerClient({
    cache: new WorkerCachemap({ name: "test", type: "someType", worker }),
    debugManager: new DebugManager({
      environment: camelCase(name) as Environment,
      log,
      name,
      performance,
    }),
    worker,
  });
}
