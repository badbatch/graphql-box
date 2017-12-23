import { expect } from "chai";
import { browserArgs, serverArgs } from "../helpers";
import createHandl from "../../src";
import Client from "../../src/client";
import WorkerClient from "../../src/worker-client";

describe("the createHandl method", () => {
  if (process.env.WEB_ENV) {
    context("when the environment is a browser", () => {
      context("when the browser supports web workers", () => {
        it("the method should return an instance of the WorkerClient class", async () => {
          const workerClient = await createHandl(browserArgs) as WorkerClient;
          expect(workerClient).to.be.instanceof(WorkerClient);
          workerClient.terminate();
        });
      });

      context("when the browser does not support web workers", () => {
        const worker: Worker = self.Worker;

        before(() => {
          delete self.Worker;
        });

        after(() => {
          self.Worker = worker;
        });

        it("the method should return an instance of the Client class", async () => {
          const client = await createHandl(browserArgs);
          expect(client).to.be.instanceof(Client);
        });
      });
    });
  } else {
    context("when the environment is a server", () => {
      it("the method should return an instance of the Client class", async () => {
        const client = await createHandl(serverArgs);
        expect(client).to.be.instanceof(Client);
      });
    });
  }
});

if (process.env.WEB_ENV) {
  require("./browser");
} else {
  require("./server");
}
