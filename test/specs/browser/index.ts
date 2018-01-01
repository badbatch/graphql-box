import Cacheability from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { github } from "../../data/graphql";
import { browserArgs, mockGraphqlRequest, workerArgs } from "../../helpers";
import createHandl from "../../../src";
import Client from "../../../src/client";
import { ClientArgs, RequestResult, ResponseCacheEntryResult } from "../../../src/types";

function testExternalMode(args: ClientArgs, suppressWorkers: boolean = false): void {
  describe(`the handl class in 'external' mode ${!suppressWorkers && "with web workers"}`, () => {
    let worker: Worker;
    let client: Client;

    before(async () => {
      if (suppressWorkers) {
        worker = self.Worker;
        delete self.Worker;
      }

      client = await createHandl(args) as Client;
    });

    after(() => {
      if (worker) self.Worker = worker;
    });

    describe("the request method", () => {
      context("when a single query is requested", () => {
        let result: RequestResult;

        beforeEach(async () => {
          mockGraphqlRequest(github.requests.singleQuery);

          try {
            result = await client.request(
              github.requests.singleQuery,
              { awaitDataCached: true },
            ) as RequestResult;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        afterEach(async () => {
          await client.clearCache();
          fetchMock.restore();
        });

        it("then the method should return the requested data", () => {
          expect(result.data).to.deep.equal(github.responses.singleQuery.data);
          expect(result.queryHash).to.be.a("string");
          expect(result.cacheMetadata.size).to.equal(1);
          const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
          expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
        });

        it("then the client should have cached the response against the query", async () => {
          const cacheSize = await client.getResponseCacheSize();
          expect(cacheSize).to.equal(2);
          const cacheEntry = await client.getResponseCacheEntry(result.queryHash as string) as ResponseCacheEntryResult;
          expect(cacheEntry.data).to.deep.equal(github.responses.singleQuery.data);
          expect(cacheEntry.cacheMetadata.size).to.equal(1);
          const queryCacheMetadata = cacheEntry.cacheMetadata.get("query") as Cacheability;
          expect(queryCacheMetadata.metadata.cacheControl.maxAge).to.equal(300000);
        });

        it("then the client should cache each data object in the response against its query path", async () => {
          const cacheSize = await client.getDataPathCacheSize();
          expect(cacheSize).to.eql(16);
        });
      });
    });
  });
}

// testExternalMode(workerArgs);
testExternalMode(browserArgs, true);
