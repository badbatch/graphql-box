import Cacheability from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { tesco } from "../../data/graphql";
import { mockRestRequest, serverArgs } from "../../helpers";
import createHandl from "../../../src";
import Client from "../../../src/client";
import { RequestResult } from "../../../src/types";

describe("the handl class in 'internal' mode", () => {
  let client: Client;

  before(async () => {
    client = await createHandl(serverArgs) as Client;
  });

  describe("the request method", () => {
    context("when a single query is requested", () => {
      let result: RequestResult;

      beforeEach(async () => {
        mockRestRequest("product", "402-5806");

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
        fetchMock.restore();
      });

      it("then the method should return the requested data", () => {
        expect(result.data).to.deep.equal(tesco.responses.singleQuery);
        expect(result.queryHash).to.be.a("string");
        expect(result.cacheMetadata.size).to.equal(2);
        const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
        expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(28800);
        const productCacheability = result.cacheMetadata.get("product") as Cacheability;
        expect(productCacheability.metadata.cacheControl.maxAge).to.equal(28800);
      });

      it("then the graphql schema should have made a fetch request", () => {
        expect(fetchMock.calls().matched).to.have.lengthOf(1);
      });

      it("then the client should have cached the response against the query", async () => {
        const responseCache = client.cache.responses;
        const cacheSize = await responseCache.size();
        expect(cacheSize).to.equal(2);
        const cacheEntry = await responseCache.get(result.queryHash as string);
        expect(result.data).to.deep.equal(cacheEntry.data);
        expect(Object.keys(cacheEntry.cacheMetadata).length).to.equal(2);
        const queryCacheMetadata = cacheEntry.cacheMetadata.query;
        expect(queryCacheMetadata.cacheControl.maxAge).to.equal(28800);
        const productCacheMetadata = cacheEntry.cacheMetadata.product;
        expect(productCacheMetadata.cacheControl.maxAge).to.equal(28800);
      });

      it("then the client should cache each data object in the response against its query path", async () => {
        const dataObjectCache = client.cache.dataObjects;
        const cacheSize = await dataObjectCache.size();
        expect(cacheSize).to.eql(6);
      });
    });
  });
});
