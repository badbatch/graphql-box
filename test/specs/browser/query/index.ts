import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as sinon from "sinon";
import { github, tesco } from "../../../data/graphql";
import { mockGraphqlRequest, serverArgs, stripSpaces } from "../../../helpers";
import { DefaultHandl, Handl, WorkerHandl } from "../../../../src";

import {
  CacheMetadata,
  ClientArgs,
  RequestResult,
  RequestResultData,
  ResponseCacheEntryResult,
} from "../../../../src/types";

export default function testQueryOperation(args: ClientArgs, opts: { suppressWorkers?: boolean } = {}): void {
  describe(`the handl client on the browser ${!opts.suppressWorkers ? "with web workers" : ""}`, () => {
    let worker: Worker;
    let client: DefaultHandl | WorkerHandl;

    before(async () => {
      if (opts.suppressWorkers) {
        worker = self.Worker;
        delete self.Worker;
      }
    });

    after(() => {
      if (worker) self.Worker = worker;
    });

    describe("the request method", () => {
      context("when a single query is requested", () => {
        before(async () => {
          if (opts.suppressWorkers) {
            mockGraphqlRequest(github.requests.updatedSingleQuery);
            mockGraphqlRequest(github.requests.partialSingleQuery);
          }

          client = await Handl.create(args) as DefaultHandl | WorkerHandl;
          await client.clearCache();
        });

        after(() => {
          if (opts.suppressWorkers) fetchMock.restore();
        });

        context("when there is no matching query in any cache", () => {
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(
                github.requests.singleQuery,
                { awaitDataCached: true, variables: { login: "facebook" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.singleQuery.data);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(1);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (opts.suppressWorkers) {
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
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(
                github.requests.singleQuery,
                { awaitDataCached: true, variables: { login: "facebook" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            if (opts.suppressWorkers) fetchMock.reset();

            try {
              result = await client.request(
                github.requests.singleQuery,
                { awaitDataCached: true, variables: { login: "facebook" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.singleQuery.data);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(1);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (opts.suppressWorkers) {
            it("then the client should not have made a fetch request", () => {
              expect(fetchMock.calls().matched).to.have.lengthOf(0);
            });
          }
        });

        context("when there is a matching query in the active request map", () => {
          let result: RequestResult[];

          beforeEach(async () => {
            try {
              result = await Promise.all([
                client.request(
                  github.requests.singleQuery,
                  { awaitDataCached: true, variables: { login: "facebook" } },
                ),
                client.request(
                  github.requests.singleQuery,
                  { awaitDataCached: true, variables: { login: "facebook" } },
                ),
              ]);
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            const [resultOne, resultTwo] = result as RequestResultData[];
            expect(resultOne).to.deep.equal(resultTwo);
            expect(resultTwo.data).to.deep.equal(github.responses.singleQuery.data);
            expect(resultTwo.queryHash).to.be.a("string");
            const cacheMetadata = resultTwo.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(1);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (opts.suppressWorkers) {
            it("then the client should have made one fetch request", () => {
              expect(fetchMock.calls().matched).to.have.lengthOf(1);
            });
          }
        });

        context("when a query response can be constructed from the data path cache", () => {
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(
                github.requests.singleQuery,
                { awaitDataCached: true, variables: { login: "facebook" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            if (opts.suppressWorkers) fetchMock.reset();

            try {
              result = await client.request(
                github.requests.reducedSingleQuery,
                { awaitDataCached: true, variables: { login: "facebook" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.reducedSingleQuery.data);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(5);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const organizationCacheability = cacheMetadata.get("organization") as Cacheability;
            expect(organizationCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const repositoriesCacheability = cacheMetadata.get("organization.repositories") as Cacheability;
            expect(repositoriesCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const nodeCacheability = cacheMetadata.get("organization.repositories.edges.node") as Cacheability;
            expect(nodeCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const ownerCacheability = cacheMetadata.get("organization.repositories.edges.node.owner") as Cacheability;
            expect(ownerCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (opts.suppressWorkers) {
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

        context("when a query response can be partially constructed from the caches", () => {
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(
                github.requests.singleQuery,
                { awaitDataCached: true, variables: { login: "facebook" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            if (opts.suppressWorkers) fetchMock.reset();

            try {
              result = await client.request(
                github.requests.extendedSingleQuery,
                { awaitDataCached: true, variables: { login: "facebook" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.extendedSingleQuery.data);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(5);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const organizationCacheability = cacheMetadata.get("organization") as Cacheability;
            expect(organizationCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const repositoriesCacheability = cacheMetadata.get("organization.repositories") as Cacheability;
            expect(repositoriesCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const nodeCacheability = cacheMetadata.get("organization.repositories.edges.node") as Cacheability;
            expect(nodeCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const ownerCacheability = cacheMetadata.get("organization.repositories.edges.node.owner") as Cacheability;
            expect(ownerCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (opts.suppressWorkers) {
            it("then the client should have made one fetch request", () => {
              const matched = fetchMock.calls().matched;
              expect(matched).to.have.lengthOf(1);
              const requestOpts = matched[0][1] as RequestInit;
              const matchedBody = JSON.parse(requestOpts.body as string);
              expect(stripSpaces(github.requests.partialSingleQuery)).to.equal(stripSpaces(matchedBody.query));
            });
          }

          it("then the client should have cached the responses against the queries", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(4);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(github.responses.extendedSingleQuery.data);
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

          it("then the client should cache each data object in the response against its query path", async () => {
            const cacheSize = await client.getDataPathCacheSize();
            expect(cacheSize).to.eql(21);
          });

          it("then the client should cache each data entity in the response against its identifier", async () => {
            const cacheSize = await client.getDataEntityCacheSize();
            expect(cacheSize).to.eql(14);
          });
        });
      });

      context("when a sugared query is requested", () => {
        before(async () => {
          if (opts.suppressWorkers) {
            mockGraphqlRequest(github.requests.updatedSingleQuery);
            mockGraphqlRequest(github.requests.updatedSugaredSingleQuery);
          }

          client = await Handl.create(args) as DefaultHandl | WorkerHandl;
          await client.clearCache();
        });

        after(() => {
          if (opts.suppressWorkers) fetchMock.restore();
        });

        context("when there is no matching query in any cache", () => {
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(github.requests.sugaredSingleQuery, {
                awaitDataCached: true,
                fragments: [github.requests.sugaredSingleQueryFragment],
                variables: { login: "facebook", withOwner: true },
              }) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.sugaredSingleQuery.data);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(1);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (opts.suppressWorkers) {
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

            expect(cacheEntry.data).to.deep.equal(github.responses.sugaredSingleQuery.data);
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
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(github.requests.sugaredSingleQuery, {
                awaitDataCached: true,
                fragments: [github.requests.sugaredSingleQueryFragment],
                variables: { login: "facebook", withOwner: true },
              }) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            if (opts.suppressWorkers) fetchMock.reset();

            try {
              result = await client.request(github.requests.sugaredSingleQuery, {
                awaitDataCached: true,
                fragments: [github.requests.sugaredSingleQueryFragment],
                variables: { login: "facebook", withOwner: true },
              }) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.sugaredSingleQuery.data);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(1);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (opts.suppressWorkers) {
            it("then the client should not have made a fetch request", () => {
              expect(fetchMock.calls().matched).to.have.lengthOf(0);
            });
          }
        });

        context("when a query response can be constructed from the data path cache", () => {
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(
                github.requests.singleQuery,
                { awaitDataCached: true, variables: { login: "facebook" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            if (opts.suppressWorkers) fetchMock.reset();

            try {
              result = await client.request(github.requests.sugaredSingleQuery, {
                awaitDataCached: true,
                fragments: [github.requests.sugaredSingleQueryFragment],
                variables: { login: "facebook", withOwner: true },
              }) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(github.responses.sugaredSingleQuery.data);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(5);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const organizationCacheability = cacheMetadata.get("organization") as Cacheability;
            expect(organizationCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const repositoriesCacheability = cacheMetadata.get("organization.firstSix") as Cacheability;
            expect(repositoriesCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const nodeCacheability = cacheMetadata.get("organization.firstSix.edges.node") as Cacheability;
            expect(nodeCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const ownerCacheability = cacheMetadata.get("organization.firstSix.edges.node.owner") as Cacheability;
            expect(ownerCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });

          if (opts.suppressWorkers) {
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
            const repositoriesCacheability = cacheEntry.cacheMetadata.get("organization.firstSix") as Cacheability;
            expect(repositoriesCacheability.metadata.cacheControl.maxAge).to.equal(300000);
            const nodeCacheability = cacheEntry.cacheMetadata.get("organization.firstSix.edges.node") as Cacheability;
            expect(nodeCacheability.metadata.cacheControl.maxAge).to.equal(300000);

            const ownerCacheability = cacheEntry.cacheMetadata.get(
              "organization.firstSix.edges.node.owner",
            ) as Cacheability;

            expect(ownerCacheability.metadata.cacheControl.maxAge).to.equal(300000);
          });
        });
      });

      context("when a batched query is requested", () => {
        let stub: sinon.SinonStub;

        before(async () => {
          if (opts.suppressWorkers) {
            fetchMock.spy();
          }

          stub = sinon.stub(console, "warn");
          client = await Handl.create({ ...serverArgs, batch: true }) as DefaultHandl;
          await client.clearCache();
        });

        after(() => {
          if (opts.suppressWorkers) fetchMock.restore();
          stub.restore();
        });

        context("when there are no matching queries in any cache", () => {
          let batchedResults: RequestResultData[];

          beforeEach(async () => {
            try {
              batchedResults = await Promise.all([
                client.request(
                  tesco.requests.batchProductQuery,
                  { awaitDataCached: true, variables: { id: "402-5806" } },
                ),
                client.request(
                  tesco.requests.batchProductQuery,
                  { awaitDataCached: true, variables: { id: "522-7645" } },
                ),
                client.request(
                  tesco.requests.batchSkuQuery,
                  { awaitDataCached: true, variables: { id: "104-7702" } },
                ),
                client.request(
                  tesco.requests.batchSkuQuery,
                  { awaitDataCached: true, variables: { id: "134-5203" } },
                ),
              ]) as RequestResultData[];
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            const data = batchedResults.map((result) => result.data);
            expect(data).to.deep.equal(tesco.responses.batchedQuery);

            batchedResults.forEach((result) => {
              expect(result.queryHash).to.be.a("string");
              const cacheMetadata = result.cacheMetadata as CacheMetadata;
              expect(cacheMetadata.size).to.equal(2);
              const isProduct = cacheMetadata.has("product");
              const ttl = isProduct ? 28800 : 14400;
              const key = isProduct ? "product" : "sku";
              const queryCacheability = cacheMetadata.get("query") as Cacheability;
              expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(ttl);
              const productCacheability = cacheMetadata.get(key) as Cacheability;
              expect(productCacheability.metadata.cacheControl.maxAge).to.equal(ttl);
            });
          });

          if (opts.suppressWorkers) {
            it("then the client should have made a fetch request", () => {
              expect(fetchMock.calls().unmatched).to.have.lengthOf(1);
            });
          }

          it("then the client should have cached the responses against the queries", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(5);

            await Promise.all(batchedResults.map(async (result) => {
              const cacheEntry = await client.getResponseCacheEntry(
                result.queryHash as string,
              ) as ResponseCacheEntryResult;

              expect(cacheEntry.data).to.deep.equal(result.data);
              expect(cacheEntry.cacheMetadata.size).to.equal(2);
              const isProduct = cacheEntry.cacheMetadata.has("product");
              const ttl = isProduct ? 28800 : 14400;
              const key = isProduct ? "product" : "sku";
              const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
              expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(ttl);
              const productCacheability = cacheEntry.cacheMetadata.get(key) as Cacheability;
              expect(productCacheability.metadata.cacheControl.maxAge).to.equal(ttl);
            }));
          });

          it("then the client should cache each data object in the response against its query path", async () => {
            const cacheSize = await client.getDataPathCacheSize();
            expect(cacheSize).to.eql(7);
          });

          it("then the client should cache each data entity in the response against its identifier", async () => {
            const cacheSize = await client.getDataEntityCacheSize();
            expect(cacheSize).to.eql(7);
          });
        });

        context("when there are matching queries in the response cache", () => {
          let batchedResults: RequestResultData[];

          beforeEach(async () => {
            try {
              await Promise.all([
                client.request(
                  tesco.requests.batchProductQuery,
                  { awaitDataCached: true, variables: { id: "402-5806" } },
                ),
                client.request(
                  tesco.requests.batchProductQuery,
                  { awaitDataCached: true, variables: { id: "522-7645" } },
                ),
                client.request(
                  tesco.requests.batchSkuQuery,
                  { awaitDataCached: true, variables: { id: "104-7702" } },
                ),
                client.request(
                  tesco.requests.batchSkuQuery,
                  { awaitDataCached: true, variables: { id: "134-5203" } },
                ),
              ]);
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            if (opts.suppressWorkers) fetchMock.reset();

            try {
              batchedResults = await Promise.all([
                client.request(
                  tesco.requests.batchProductQuery,
                  { awaitDataCached: true, variables: { id: "402-5806" } },
                ),
                client.request(
                  tesco.requests.batchProductQuery,
                  { awaitDataCached: true, variables: { id: "522-7645" } },
                ),
                client.request(
                  tesco.requests.batchSkuQuery,
                  { awaitDataCached: true, variables: { id: "104-7702" } },
                ),
                client.request(
                  tesco.requests.batchSkuQuery,
                  { awaitDataCached: true, variables: { id: "134-5203" } },
                ),
              ]) as RequestResultData[];
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            if (opts.suppressWorkers) fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            const data = batchedResults.map((result) => result.data);
            expect(data).to.deep.equal(tesco.responses.batchedQuery);

            batchedResults.forEach((result) => {
              expect(result.queryHash).to.be.a("string");
              const cacheMetadata = result.cacheMetadata as CacheMetadata;
              expect(cacheMetadata.size).to.equal(2);
              const isProduct = cacheMetadata.has("product");
              const ttl = isProduct ? 28800 : 14400;
              const key = isProduct ? "product" : "sku";
              const queryCacheability = cacheMetadata.get("query") as Cacheability;
              expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(ttl);
              const productCacheability = cacheMetadata.get(key) as Cacheability;
              expect(productCacheability.metadata.cacheControl.maxAge).to.equal(ttl);
            });
          });

          if (opts.suppressWorkers) {
            it("then the client should not have made a fetch request", () => {
              expect(fetchMock.calls().unmatched).to.have.lengthOf(0);
            });
          }
        });
      });
    });
  });
}
