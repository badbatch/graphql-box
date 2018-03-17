import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as http from "http";
import { get } from "lodash";
import * as sinon from "sinon";
import { tesco } from "../../../data/graphql";
import { mockRestRequest, stripSpaces } from "../../../helpers";
import graphqlServer from "../../../server";
import { ClientHandl, Handl } from "../../../../src";
import CacheManager from "../../../../src/cache-manager";

import {
  ClientArgs,
  RequestResult,
  RequestResultData,
  ResponseCacheEntryResult,
} from "../../../../src/types";

export default function testQueryOperation(args: ClientArgs): void {
  describe("the handl client on the server", () => {
    let client: ClientHandl;
    let server: http.Server;
    let stub: sinon.SinonStub;

    before(async () => {
      stub = sinon.stub(console, "warn");
      server = await graphqlServer();
    });

    after(() => {
      stub.restore();
      server.close();
    });

    describe("the request method", () => {
      context("when a single query is requested", () => {
        before(async () => {
          client = await Handl.create(args) as ClientHandl;
          await client.clearCache();
          mockRestRequest("product", "402-5806");
          mockRestRequest("sku", "134-5203");
          fetchMock.spy();
        });

        after(() => {
          fetchMock.restore();
        });

        context("when there is no matching query in any cache", () => {
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(
                tesco.requests.singleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.singleQuery);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(4);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made one fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(1);
          });

          it("then the client should have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(2);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(tesco.responses.singleQuery);
            expect(cacheEntry.cacheMetadata.size).to.equal(4);
            const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheEntry.cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheEntry.cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheEntry.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should cache each data object in the response against its query path", async () => {
            const cacheSize = await client.getQueryPathCacheSize();
            expect(cacheSize).to.eql(6);
          });

          it("then the client should cache each data entity in the response against its identifier", async () => {
            const cacheSize = await client.getDataEntityCacheSize();
            expect(cacheSize).to.eql(4);
          });
        });

        context("when there is a matching query in the response cache", () => {
          let result: RequestResultData;
          let spy: sinon.SinonSpy;

          beforeEach(async () => {
            try {
              result = await client.request(
                tesco.requests.singleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            fetchMock.reset();
            const cache: CacheManager = get(client, "_cache");
            spy = sinon.spy(cache, "analyze");

            try {
              result = await client.request(
                tesco.requests.singleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            spy.restore();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.singleQuery);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(4);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made no fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(0);
          });

          it("then the client should not have called the cache's analyze method", () => {
            expect(spy.notCalled).to.equal(true);
          });
        });

        context("when there is a matching query in the active request map", () => {
          let result: RequestResult[];
          let spy: sinon.SinonSpy;

          beforeEach(async () => {
            const cache: CacheManager = get(client, "_cache");
            spy = sinon.spy(cache, "analyze");

            try {
              result = await Promise.all([
                client.request(
                  tesco.requests.singleQuery,
                  { awaitDataCached: true, variables: { id: "402-5806" } },
                ),
                client.request(
                  tesco.requests.singleQuery,
                  { awaitDataCached: true, variables: { id: "402-5806" } },
                ),
              ]);
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            spy.restore();
          });

          it("then the method should return the requested data", () => {
            const [resultOne, resultTwo] = result as RequestResultData[];
            expect(resultOne).to.deep.equal(resultTwo);
            expect(resultTwo.data).to.deep.equal(tesco.responses.singleQuery);
            expect(resultTwo.queryHash).to.be.a("string");
            const cacheMetadata = resultTwo.cacheMetadata;
            expect(cacheMetadata.size).to.equal(4);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made one fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(1);
          });

          it("then the client should have called the cache's analyze method once", () => {
            expect(spy.calledOnce).to.equal(true);
          });
        });

        context("when a query response can be constructed from the data path cache", () => {
          let result: RequestResultData;
          let spy: sinon.SinonSpy;

          beforeEach(async () => {
            try {
              result = await client.request(
                tesco.requests.singleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            fetchMock.reset();
            const cache: CacheManager = get(client, "_cache");
            spy = sinon.spy(cache, "resolveQuery");

            try {
              result = await client.request(
                tesco.requests.reducedSingleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            spy.restore();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.reducedSingleQuery);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made no fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(0);
          });

          it("then the client should have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(3);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(tesco.responses.reducedSingleQuery);
            expect(cacheEntry.cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheEntry.cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheEntry.cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheEntry.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should not have called the cache's resolveQuery method", () => {
            expect(spy.notCalled).to.equal(true);
          });
        });

        context("when a query response can be constructed from the data entity cache", () => {
          let result: RequestResultData;
          let spy: sinon.SinonSpy;

          beforeEach(async () => {
            try {
              result = await client.request(
                tesco.requests.singleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            fetchMock.reset();
            const cache: CacheManager = get(client, "_cache");
            cache.queryPaths.clear();
            spy = sinon.spy(cache, "resolveQuery");

            try {
              result = await client.request(
                tesco.requests.reducedSingleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            spy.restore();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.reducedSingleQuery);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made no fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(0);
          });

          it("then the client should have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(3);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(tesco.responses.reducedSingleQuery);
            expect(cacheEntry.cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheEntry.cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheEntry.cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheEntry.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should not have called the cache's resolveQuery method", () => {
            expect(spy.notCalled).to.equal(true);
          });
        });

        context("when a query response can be partially constructed from the caches", () => {
          let result: RequestResultData;
          let spy: sinon.SinonSpy;

          beforeEach(async () => {
            try {
              result = await client.request(
                tesco.requests.singleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            fetchMock.reset();
            const clientFetch = { fetch: get(client, "_fetch") };
            spy = sinon.spy(clientFetch, "fetch");

            try {
              result = await client.request(
                tesco.requests.extendedSingleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            spy.restore();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.extendedSingleQuery);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made one fetch request", () => {
            const unmatched = fetchMock.calls().unmatched;
            expect(unmatched).to.have.lengthOf(1);
            const requestOpts = unmatched[0][1] as RequestInit;
            const unmatchedBody = JSON.parse(requestOpts.body as string);
            expect(stripSpaces(tesco.requests.partialSingleQuery)).to.equal(stripSpaces(unmatchedBody.query));
          });

          it("then the client should have cached the responses against the queries", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(4);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(tesco.responses.extendedSingleQuery);
            expect(cacheEntry.cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheEntry.cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheEntry.cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheEntry.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should cache each data object in the response against its query path", async () => {
            const cacheSize = await client.getQueryPathCacheSize();
            expect(cacheSize).to.eql(6);
          });

          it("then the client should cache each data entity in the response against its identifier", async () => {
            const cacheSize = await client.getDataEntityCacheSize();
            expect(cacheSize).to.eql(4);
          });
        });
      });

      context("when a sugared query is requested", () => {
        before(async () => {
          client = await Handl.create(args) as ClientHandl;
          await client.clearCache();
          mockRestRequest("product", "402-5806");
          mockRestRequest("sku", "134-5203");
          fetchMock.spy();
        });

        after(() => {
          fetchMock.restore();
        });

        context("when there is no matching query in any cache", () => {
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(tesco.requests.sugaredSingleQuery, {
                awaitDataCached: true,
                fragments: [tesco.requests.sugaredSingleQueryFragment],
                variables: { id: "402-5806" },
              }) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.sugaredSingleQuery);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.primaryChild") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.primaryChild.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made one fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(1);
          });

          it("then the client should have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(2);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(tesco.responses.sugaredSingleQuery);
            expect(cacheEntry.cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheEntry.cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheEntry.cacheMetadata.get("product.primaryChild") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);

            const parentCacheability = cacheEntry.cacheMetadata.get(
              "product.primaryChild.parentProduct",
            ) as Cacheability;

            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should cache each data object in the response against its query path", async () => {
            const cacheSize = await client.getQueryPathCacheSize();
            expect(cacheSize).to.eql(6);
          });

          it("then the client should cache each data entity in the response against its identifier", async () => {
            const cacheSize = await client.getDataEntityCacheSize();
            expect(cacheSize).to.eql(4);
          });
        });

        context("when there is a matching query in the response cache", () => {
          let result: RequestResultData;
          let spy: sinon.SinonSpy;

          beforeEach(async () => {
            try {
              result = await client.request(tesco.requests.sugaredSingleQuery, {
                awaitDataCached: true,
                fragments: [tesco.requests.sugaredSingleQueryFragment],
                variables: { id: "402-5806" },
              }) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            fetchMock.reset();
            const cache: CacheManager = get(client, "_cache");
            spy = sinon.spy(cache, "analyze");

            try {
              result = await client.request(tesco.requests.sugaredSingleQuery, {
                awaitDataCached: true,
                fragments: [tesco.requests.sugaredSingleQueryFragment],
                variables: { id: "402-5806" },
              }) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            spy.restore();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.sugaredSingleQuery);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.primaryChild") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.primaryChild.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made no fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(0);
          });

          it("then the client should not have called the cache's analyze method", () => {
            expect(spy.notCalled).to.equal(true);
          });
        });

        context("when a query response can be constructed from the data path cache", () => {
          let result: RequestResultData;
          let spy: sinon.SinonSpy;

          beforeEach(async () => {
            try {
              result = await client.request(
                tesco.requests.singleQuery,
                { awaitDataCached: true, variables: { id: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }

            fetchMock.reset();
            const cache: CacheManager = get(client, "_cache");
            spy = sinon.spy(cache, "resolveQuery");

            try {
              result = await client.request(tesco.requests.sugaredSingleQuery, {
                awaitDataCached: true,
                fragments: [tesco.requests.sugaredSingleQueryFragment],
                variables: { id: "402-5806" },
              }) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            spy.restore();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.sugaredSingleQuery);
            expect(result.queryHash).to.be.a("string");
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.primaryChild") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.primaryChild.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should have made no fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(0);
          });

          it("then the client should have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(3);

            const cacheEntry = await client.getResponseCacheEntry(
              result.queryHash as string,
            ) as ResponseCacheEntryResult;

            expect(cacheEntry.data).to.deep.equal(tesco.responses.sugaredSingleQuery);
            expect(cacheEntry.cacheMetadata.size).to.equal(6);
            const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
            expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const productCacheability = cacheEntry.cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheEntry.cacheMetadata.get("product.primaryChild") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);

            const parentCacheability = cacheEntry.cacheMetadata.get(
              "product.primaryChild.parentProduct",
            ) as Cacheability;

            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          });

          it("then the client should not have called the cache's resolveQuery method", () => {
            expect(spy.notCalled).to.equal(true);
          });
        });
      });

      context("when a batched query is requested", () => {
        before(async () => {
          client = await Handl.create({ ...args, batch: true }) as ClientHandl;
          await client.clearCache();
          mockRestRequest("product", "402-5806");
          mockRestRequest("product", "522-7645");
          mockRestRequest("sku", "104-7702");
          mockRestRequest("sku", "134-5203");
          fetchMock.spy();
        });

        after(() => {
          fetchMock.restore();
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
            fetchMock.reset();
          });

          it("then the method should return the requested data", () => {
            const data = batchedResults.map((result) => result.data);
            expect(data).to.deep.equal(tesco.responses.batchedQuery);

            batchedResults.forEach((result) => {
              expect(result.queryHash).to.be.a("string");
              const cacheMetadata = result.cacheMetadata;
              expect(cacheMetadata.size).to.be.within(2, 3);
              const isProduct = cacheMetadata.has("product");
              const ttl = isProduct ? 28800 : 14400;
              const key = isProduct ? "product" : "sku";
              const queryCacheability = cacheMetadata.get("query") as Cacheability;
              expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= ttl).to.equal(true);
              const itemCacheability = cacheMetadata.get(key) as Cacheability;
              expect(Number(itemCacheability.metadata.cacheControl.maxAge) <= ttl).to.equal(true);
            });
          });

          it("then the client should have made one fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(1);
          });

          it("then the client should have cached the responses against the queries", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(5);

            await Promise.all(batchedResults.map(async (result) => {
              const cacheEntry = await client.getResponseCacheEntry(
                result.queryHash as string,
              ) as ResponseCacheEntryResult;

              expect(cacheEntry.data).to.deep.equal(result.data);
              expect(cacheEntry.cacheMetadata.size).to.be.within(2, 3);
              const isProduct = cacheEntry.cacheMetadata.has("product");
              const ttl = isProduct ? 28800 : 14400;
              const key = isProduct ? "product" : "sku";
              const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
              expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= ttl).to.equal(true);
              const itemCacheability = cacheEntry.cacheMetadata.get(key) as Cacheability;
              expect(Number(itemCacheability.metadata.cacheControl.maxAge) <= ttl).to.equal(true);
            }));
          });

          it("then the client should cache each data object in the response against its query path", async () => {
            const cacheSize = await client.getQueryPathCacheSize();
            expect(cacheSize).to.eql(7);
          });

          it("then the client should cache each data entity in the response against its identifier", async () => {
            const cacheSize = await client.getDataEntityCacheSize();
            expect(cacheSize).to.eql(7);
          });
        });

        context("when there are matching queries in the response cache", () => {
          let batchedResults: RequestResultData[];
          let spy: sinon.SinonSpy;

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

            fetchMock.reset();
            const cache: CacheManager = get(client, "_cache");
            spy = sinon.spy(cache, "analyze");

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
            fetchMock.reset();
            spy.restore();
          });

          it("then the method should return the requested data", () => {
            const data = batchedResults.map((result) => result.data);
            expect(data).to.deep.equal(tesco.responses.batchedQuery);

            batchedResults.forEach((result) => {
              expect(result.queryHash).to.be.a("string");
              const cacheMetadata = result.cacheMetadata;
              expect(cacheMetadata.size).to.be.within(2, 3);
              const isProduct = cacheMetadata.has("product");
              const ttl = isProduct ? 28800 : 14400;
              const key = isProduct ? "product" : "sku";
              const queryCacheability = cacheMetadata.get("query") as Cacheability;
              expect(Number(queryCacheability.metadata.cacheControl.maxAge) <= ttl).to.equal(true);
              const itemCacheability = cacheMetadata.get(key) as Cacheability;
              expect(Number(itemCacheability.metadata.cacheControl.maxAge) <= ttl).to.equal(true);
            });
          });

          it("then the client should have made no fetch request", () => {
            expect(fetchMock.calls().unmatched).to.have.lengthOf(0);
          });

          it("then the client should not have called the cache's analyze method", () => {
            expect(spy.notCalled).to.equal(true);
          });
        });
      });
    });
  });
}
