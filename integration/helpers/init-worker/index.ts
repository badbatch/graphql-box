import debugManager from "@graphql-box/debug-manager";
import WorkerClient from "@graphql-box/worker-client";
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
