import { expect } from "chai";
import { serverClientArgs, workerClientArgs } from "../helpers";
import { DefaultHandl, Handl, WorkerHandl } from "../../src";
import { supportsWorkerIndexedDB } from "../../src/helpers/user-agent-parser";

describe("the Client.create method", () => {
  if (process.env.WEB_ENV) {
    context("when the environment is a browser", () => {
      context("when the browser supports web workers", () => {
        it("the method should return an instance of the WorkerClient class", async () => {
          const client = await Handl.create(workerClientArgs);

          if (supportsWorkerIndexedDB(self.navigator.userAgent)) {
            expect(client).to.be.instanceof(WorkerHandl);
          } else {
            expect(client).to.be.instanceof(DefaultHandl);
          }

          if (client instanceof WorkerHandl) client.terminate();
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
          const client = await Handl.create(workerClientArgs);
          expect(client).to.be.instanceof(DefaultHandl);
        });
      });
    });
  } else {
    context("when the environment is a server", () => {
      it("the method should return an instance of the Client class", async () => {
        const client = await Handl.create(serverClientArgs);
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
