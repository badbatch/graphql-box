import Cacheability from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { get } from "lodash";
import * as sinon from "sinon";
import { tesco } from "../../data/graphql";
import { mockRestRequest, serverArgs } from "../../helpers";
import createHandl from "../../../src";
import Cache from "../../../src/cache";
import Client from "../../../src/client";
import { RequestResult, ResponseCacheEntryResult } from "../../../src/types";

describe("the handl class in 'internal' mode", () => {
  let client: Client;

  before(async () => {
    client = await createHandl(serverArgs) as Client;
  });

  describe("the request method", () => {
    context("when a single query is requested", () => {
      before(() => {
        mockRestRequest("product", "402-5806");
        mockRestRequest("sku", "134-5203");
      });

      after(() => {
        fetchMock.restore();
      });

      context("when there is no matching query in any cache", () => {
        let result: RequestResult;

        beforeEach(async () => {
          try {
            result = await client.request(
              tesco.requests.singleQuery,
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
          expect(result.data).to.deep.equal(tesco.responses.singleQuery);
          expect(result.queryHash).to.be.a("string");
          expect(result.cacheMetadata.size).to.equal(4);
          const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
          expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const productCacheability = result.cacheMetadata.get("product") as Cacheability;
          expect(productCacheability.metadata.cacheControl.maxAge).to.equal(28800);
          const defaultSkuCacheability = result.cacheMetadata.get("product.defaultSku") as Cacheability;
          expect(defaultSkuCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const parentCacheability = result.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
          expect(parentCacheability.metadata.cacheControl.maxAge).to.equal(28800);
        });

        it("then the graphql schema should have made a fetch request", () => {
          expect(fetchMock.calls().matched).to.have.lengthOf(3);
        });

        it("then the client should have cached the response against the query", async () => {
          const cacheSize = await client.getResponseCacheSize();
          expect(cacheSize).to.equal(2);
          const cacheEntry = await client.getResponseCacheEntry(result.queryHash as string) as ResponseCacheEntryResult;
          expect(cacheEntry.data).to.deep.equal(tesco.responses.singleQuery);
          expect(cacheEntry.cacheMetadata.size).to.equal(4);
          const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
          expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const productCacheability = cacheEntry.cacheMetadata.get("product") as Cacheability;
          expect(productCacheability.metadata.cacheControl.maxAge).to.equal(28800);
          const defaultSkuCacheability = cacheEntry.cacheMetadata.get("product.defaultSku") as Cacheability;
          expect(defaultSkuCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const parentCacheability = cacheEntry.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
          expect(parentCacheability.metadata.cacheControl.maxAge).to.equal(28800);
        });

        it("then the client should cache each data object in the response against its query path", async () => {
          const cacheSize = await client.getDataObjectCacheSize();
          expect(cacheSize).to.eql(12);
        });
      });

      context("when there is a matching query in the response cache", () => {
        let result: RequestResult;
        let spy: sinon.SinonSpy;

        beforeEach(async () => {
          try {
            result = await client.request(
              tesco.requests.singleQuery,
              { awaitDataCached: true },
            ) as RequestResult;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }

          const cache: Cache = get(client, "_cache");
          spy = sinon.spy(cache, "analyze");

          try {
            result = await client.request(
              tesco.requests.singleQuery,
              { awaitDataCached: true },
            ) as RequestResult;
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
          expect(result.cacheMetadata.size).to.equal(4);
          const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
          expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const productCacheability = result.cacheMetadata.get("product") as Cacheability;
          expect(productCacheability.metadata.cacheControl.maxAge).to.equal(28800);
          const defaultSkuCacheability = result.cacheMetadata.get("product.defaultSku") as Cacheability;
          expect(defaultSkuCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const parentCacheability = result.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
          expect(parentCacheability.metadata.cacheControl.maxAge).to.equal(28800);
        });

        it("then the client should not have called the cache's analyze method", () => {
          expect(spy.notCalled).to.equal(true);
        });
      });

      context("when a query response can be constructed from the data object cache", () => {
        let result: RequestResult;
        let spy: sinon.SinonSpy;

        beforeEach(async () => {
          try {
            result = await client.request(
              tesco.requests.singleQuery,
              { awaitDataCached: true },
            ) as RequestResult;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }

          fetchMock.reset();
          const cache: Cache = get(client, "_cache");
          spy = sinon.spy(cache, "resolve");

          try {
            result = await client.request(
              tesco.requests.editedSingleQuery,
              { awaitDataCached: true },
            ) as RequestResult;
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
          expect(result.data).to.deep.equal(tesco.responses.editedSingleQuery);
          expect(result.queryHash).to.be.a("string");
          expect(result.cacheMetadata.size).to.equal(8);
          const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
          expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const productCacheability = result.cacheMetadata.get("product") as Cacheability;
          expect(productCacheability.metadata.cacheControl.maxAge).to.equal(28800);
          const defaultSkuCacheability = result.cacheMetadata.get("product.defaultSku") as Cacheability;
          expect(defaultSkuCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const parentCacheability = result.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
          expect(parentCacheability.metadata.cacheControl.maxAge).to.equal(28800);
        });

        it("then the graphql schema should not have made a fetch request", () => {
          expect(fetchMock.calls().matched).to.have.lengthOf(0);
        });

        it("then the client should have cached the response against the query", async () => {
          const cacheSize = await client.getResponseCacheSize();
          expect(cacheSize).to.equal(3);
          const cacheEntry = await client.getResponseCacheEntry(result.queryHash as string) as ResponseCacheEntryResult;
          expect(cacheEntry.data).to.deep.equal(tesco.responses.editedSingleQuery);
          expect(cacheEntry.cacheMetadata.size).to.equal(8);
          const queryCacheability = cacheEntry.cacheMetadata.get("query") as Cacheability;
          expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const productCacheability = cacheEntry.cacheMetadata.get("product") as Cacheability;
          expect(productCacheability.metadata.cacheControl.maxAge).to.equal(28800);
          const defaultSkuCacheability = cacheEntry.cacheMetadata.get("product.defaultSku") as Cacheability;
          expect(defaultSkuCacheability.metadata.cacheControl.maxAge).to.equal(14400);
          const parentCacheability = cacheEntry.cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
          expect(parentCacheability.metadata.cacheControl.maxAge).to.equal(28800);
        });

        it("then the client should not have called the cache's resolve method", () => {
          expect(spy.notCalled).to.equal(true);
        });
      });
    });
  });
});
