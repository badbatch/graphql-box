import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { github } from "../../../data/graphql";
import { mockGraphqlRequest } from "../../../helpers";
import { ClientHandl, Handl, WorkerHandl } from "../../../../src";
import { ClientArgs, RequestResultData } from "../../../../src/types";

export default function testTypeCacheControls(args: ClientArgs, opts: { suppressWorkers?: boolean } = {}): void {
  describe(`the handl client on the browser ${!opts.suppressWorkers ? "with web workers" : ""}`, () => {
    let worker: Worker;
    let onMainThread: boolean;
    let client: ClientHandl | WorkerHandl;

    before(async () => {
      if (opts.suppressWorkers) {
        worker = self.Worker;
        delete self.Worker;
        onMainThread = true;
      }

      client = await Handl.create(args) as ClientHandl;
      await client.clearCache();
      onMainThread = client instanceof ClientHandl;
      if (onMainThread) mockGraphqlRequest(github.requests.updatedSingleQuery);
    });

    after(() => {
      if (worker) self.Worker = worker;
      if (onMainThread) fetchMock.restore();
    });

    describe.only("Type cache controls", () => {
      context("when no type cache controls are set", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            result = await client.request(
              github.requests.singleQuery,
              { awaitDataCached: true, variables: { login: "facebook" } },
            )  as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.clearCache();
          if (onMainThread) fetchMock.reset();
        });

        it("then the cache metadata should reflect what was received from the server", () => {
          const cacheMetadata = result.cacheMetadata;
          expect(cacheMetadata.size).to.equal(1);
          const operationCacheability = cacheMetadata.get("query") as Cacheability;
          expect(operationCacheability.metadata.cacheControl.maxAge).to.equal(300000);
        });
      });

      /**
       * FIXME: This test is failing when it is run in a browser in a web worker, the max-age is
       * not being respected by the worker handl.
       */
      context("when a type cache control is set on the Query type", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            await client.setTypeCacheControls({ Query: "max-age=60" });

            result = await client.request(
              github.requests.singleQuery,
              { awaitDataCached: true, variables: { login: "facebook" } },
            )  as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.setTypeCacheControls({});
          await client.clearCache();
          if (onMainThread) fetchMock.reset();
        });

        it(`then the cache metadata should be made up of the Query type cache control and what was received
          from the server`, () => {
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(1);
            const operationCacheability = cacheMetadata.get("query") as Cacheability;
            expect(operationCacheability.metadata.cacheControl.maxAge).to.equal(60);
        });
      });
    });
  });
}
