import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as sinon from "sinon";
import { forAwaitEach, isAsyncIterable } from "iterall";
import { tesco } from "../../../data/graphql";
import { DefaultHandl, Handl, WorkerHandl } from "../../../../src";
import { ClientArgs, RequestResultData } from "../../../../src/types";

const deferredPromise = require("defer-promise");

export default function testSubscriptionOperation(args: ClientArgs, opts: { suppressWorkers?: boolean } = {}): void {
  describe(`the handl client on the browser ${!opts.suppressWorkers ? "with web workers" : ""}`, () => {
    let worker: Worker;
    let client: DefaultHandl | WorkerHandl;
    let stub: sinon.SinonStub;

    before(async () => {
      if (opts.suppressWorkers) {
        worker = self.Worker;
        delete self.Worker;
      }

      stub = sinon.stub(console, "warn");
      client = await Handl.create(args) as DefaultHandl | WorkerHandl;
    });

    after(() => {
      if (worker) self.Worker = worker;
      stub.restore();
    });

    describe("the request method", () => {
      context("when a single subscription has been requested", () => {
        let result: RequestResultData | undefined;

        const deferred: Array<DeferPromise.Deferred<void>> = [
          deferredPromise(),
          deferredPromise(),
          deferredPromise(),
          deferredPromise(),
          deferredPromise(),
        ];

        before(async () => {
          if (opts.suppressWorkers) {
            fetchMock.spy();
          }

          try {
            const asyncIterator = await client.request(
              tesco.requests.singleSubscription,
              { awaitDataCached: true },
            );

            if (isAsyncIterable(asyncIterator)) {
              forAwaitEach(asyncIterator, (value) => {
                result = value as RequestResultData;
                const deferredValue = deferred[0] as DeferPromise.Deferred<void>;
                deferredValue.resolve();
              });
            }
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(() => {
          if (opts.suppressWorkers) fetchMock.restore();
        });

        context("when a mutation is requested to data that is subscribed to", () => {
          beforeEach(async () => {
            try {
              await client.request(
                tesco.requests.reducedAddMutation,
                { awaitDataCached: true, variables: { productID: "402-5806" } },
              );
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            await deferred[0].promise;
            deferred.shift();
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
            result = undefined;

            await client.request(
              tesco.requests.removeMutation,
              { awaitDataCached: true, variables: { productID: "402-5806" } },
            );
          });

          it("then the method should return the subscribed data", () => {
            const _result = result as RequestResultData;
            expect(_result.data).to.deep.equal(tesco.responses.singleSubscription);
            const cacheMetadata = _result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(3);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(60);
            const favouriteCacheability = cacheMetadata.get("favouriteAdded") as Cacheability;
            expect(favouriteCacheability.metadata.cacheControl.maxAge).to.equal(60);
            const productsCacheability = cacheMetadata.get("favouriteAdded.products") as Cacheability;
            expect(productsCacheability.metadata.cacheControl.maxAge).to.equal(28800);
          });

          it("then the client should not have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(1);
          });

          it("then the client should not have stored any data in the in the data path cache", async () => {
            const cacheSize = await client.getDataPathCacheSize();
            expect(cacheSize).to.eql(1);
          });

          it("then the client should cache each data entity in the response against its identifier", async () => {
            const cacheSize = await client.getDataEntityCacheSize();
            expect(cacheSize).to.eql(4);
          });
        });
      });
    });
  });
}
