import { expect } from "chai";
import { serverArgs, workerArgs } from "../helpers";
import { DefaultHandl, Handl, WorkerHandl } from "../../src";

describe("the Client.create method", () => {
  if (process.env.WEB_ENV) {
    context("when the environment is a browser", () => {
      context("when the browser supports web workers", () => {
        it("the method should return an instance of the WorkerClient class", async () => {
          const workerClient = await Handl.create(workerArgs) as WorkerHandl;
          expect(workerClient).to.be.instanceof(WorkerHandl);
          workerClient.terminate();
        });
      });

      context("when the browser does not support web workers", () => {
        const worker = self.Worker;

        before(() => {
          delete self.Worker;
        });

        after(() => {
          self.Worker = worker;
        });

        it("the method should return an instance of the Client class", async () => {
          const client = await Handl.create(workerArgs);
          expect(client).to.be.instanceof(DefaultHandl);
        });
      });
    });
  } else {
    context("when the environment is a server", () => {
      it("the method should return an instance of the Client class", async () => {
        const client = await Handl.create(serverArgs);
        expect(client).to.be.instanceof(DefaultHandl);
      });
    });
  }
});

if (process.env.WEB_ENV) {
  require("./browser");
} else {
  require("./server");
}
