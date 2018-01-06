import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { github } from "../../data/graphql";
import { browserArgs, mockGraphqlRequest, workerArgs } from "../../helpers";
import { DefaultHandl, Handl, WorkerHandl } from "../../../src";
import { ClientArgs, RequestResult, ResponseCacheEntryResult } from "../../../src/types";

function testExternalMode(args: ClientArgs, suppressWorkers: boolean = false): void {
  describe(`the handl class in 'external' mode ${!suppressWorkers && "with web workers"}`, () => {
    let worker: Worker;
    let client: DefaultHandl | WorkerHandl;

    before(async () => {
      if (suppressWorkers) {
        worker = self.Worker;
        delete self.Worker;
      }

      client = await Handl.create(args) as DefaultHandl | WorkerHandl;
    });

    after(() => {
      if (worker) self.Worker = worker;
    });

    describe("the request method", () => {
      context("when a single query is requested", () => {
        before(() => {
          if (suppressWorkers) {
            mockGraphqlRequest(github.requests.singleQuery);
            mockGraphqlRequest(github.requests.reducedSingleQuery);
          }
        });

        after(() => {
          if (suppressWorkers) fetchMock.restore();
        });

        context("when there is no matching query in any cache", () => {
          let result: RequestResult;

          beforeEach(async () => {
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
            if (suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.singleQuery.data);
            expect(result.queryHash).to.be.a("string");
            expect(result.cacheMetadata.size).to.equal(1);
            const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (suppressWorkers) {
            it("then the client should have made a fetch request", () => {
              expect(fetchMock.calls().matched).to.have.lengthOf(1);
            });
          }

          it("then the client should have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(2);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(github.responses.singleQuery.data);
            expect(cacheEntry.cacheMetadata.size).to.equal(1);
            const queryCacheMetadata = cacheEntry.cacheMetadata.get("query") as Cacheability;
            expect(queryCacheMetadata.metadata.cacheControl.maxAge).to.equal(300000);
          });

          it("then the client should cache each data object in the response against its query path", async () => {
            const cacheSize = await client.getDataPathCacheSize();
            expect(cacheSize).to.eql(15);
          });

          it("then the client should cache each data entity in the response against its identifier", async () => {
            const cacheSize = await client.getDataEntityCacheSize();
            expect(cacheSize).to.eql(9);
          });
        });

        context("when there is a matching query in the response cache", () => {
          let result: RequestResult;

          beforeEach(async () => {
            try {
              result = await client.request(
                github.requests.singleQuery,
                { awaitDataCached: true },
              ) as RequestResult;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            fetchMock.reset();

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
            fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.singleQuery.data);
            expect(result.queryHash).to.be.a("string");
            expect(result.cacheMetadata.size).to.equal(1);
            const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (suppressWorkers) {
            it("then the client should not have made a fetch request", () => {
              expect(fetchMock.calls().matched).to.have.lengthOf(0);
            });
          }
        });

        context("when there is a matching query in the active request map", () => {
          let result: Array<RequestResult | RequestResult[]>;

          beforeEach(async () => {
            try {
              result = await Promise.all([
                client.request(
                  github.requests.singleQuery,
                  { awaitDataCached: true },
                ),
                client.request(
                  github.requests.singleQuery,
                  { awaitDataCached: true },
                ),
              ]);
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            const [resultOne, resultTwo] = result as RequestResult[];
            expect(resultOne).to.deep.equal(resultTwo);
            expect(resultTwo.data).to.deep.equal(github.responses.singleQuery.data);
            expect(resultTwo.queryHash).to.be.a("string");
            expect(resultTwo.cacheMetadata.size).to.equal(1);
            const queryCacheability = resultTwo.cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (suppressWorkers) {
            it("then the client should not have made a fetch request", () => {
              expect(fetchMock.calls().matched).to.have.lengthOf(1);
            });
          }
        });

        context("when a query response can be constructed from the data path cache", () => {
          let result: RequestResult;

          beforeEach(async () => {
            try {
              result = await client.request(
                github.requests.singleQuery,
                { awaitDataCached: true },
              ) as RequestResult;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            fetchMock.reset();

            try {
              result = await client.request(
                github.requests.reducedSingleQuery,
                { awaitDataCached: true },
              ) as RequestResult;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.reducedSingleQuery.data);
            expect(result.queryHash).to.be.a("string");
            expect(result.cacheMetadata.size).to.equal(5);
            const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const organizationCacheability = result.cacheMetadata.get("organization") as Cacheability;
            expect(organizationCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const repositoriesCacheability = result.cacheMetadata.get("organization.repositories") as Cacheability;
            expect(repositoriesCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const nodeCacheability = result.cacheMetadata.get("organization.repositories.edges.node") as Cacheability;
            expect(nodeCacheability.metadata.cacheControl.maxAge).to.equal(300000);

            const ownerCacheability = result.cacheMetadata.get(
              "organization.repositories.edges.node.owner",
            ) as Cacheability;

            expect(ownerCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (suppressWorkers) {
            it("then the client should not have made a fetch request", () => {
              expect(fetchMock.calls().matched).to.have.lengthOf(0);
            });
          }

          it("then the client should have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(3);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(github.responses.reducedSingleQuery.data);
            expect(cacheEntry.cacheMetadata.size).to.equal(5);
            const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const organizationCacheability = cacheEntry.cacheMetadata.get("organization") as Cacheability;
            expect(organizationCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const repositoriesCacheability = cacheEntry.cacheMetadata.get("organization.repositories") as Cacheability;
            expect(repositoriesCacheability.metadata.cacheControl.maxAge).to.equal(300000);

            const nodeCacheability = cacheEntry.cacheMetadata.get(
              "organization.repositories.edges.node",
            ) as Cacheability;

            expect(nodeCacheability.metadata.cacheControl.maxAge).to.equal(300000);

            const ownerCacheability = cacheEntry.cacheMetadata.get(
              "organization.repositories.edges.node.owner",
            ) as Cacheability;

            expect(ownerCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });
        });
      });
    });
  });
}

testExternalMode(workerArgs);
testExternalMode(browserArgs, true);
