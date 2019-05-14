import debugManager from "@handl/debug-manager";
import WorkerClient from "@handl/worker-client";
import { log } from "..";
import { InitWorkerClientOptions } from "../../defs";

const { performance } = self;

export default async function initWorkerClient({ worker }: InitWorkerClientOptions): Promise<WorkerClient> {
  return WorkerClient.init({
    debugManager: debugManager({
      logger: { log },
      name: "WORKER_CLIENT",
      performance,
    }),
    worker,
  });
}
