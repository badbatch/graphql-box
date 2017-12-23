import * as fetchMock from "fetch-mock";
import { expect } from "chai";
import { tesco } from "../../data/graphql";
import { mockRestRequest, serverArgs } from "../../helpers";
import createHandl from "../../../src";
import Client from "../../../src/client";
import { ClientResult, RequestResult } from "../../../src/types";

describe("the handl class in 'internal' mode", () => {
  let client: Client;

  before(async () => {
    client = await createHandl(serverArgs) as Client;
  });

  describe("the request method", () => {
    context("when a single query is requested", () => {
      let result: RequestResult | RequestResult[];

      beforeEach(async () => {
        mockRestRequest("product", "402-5806");

        try {
          result = await client.request(tesco.requests.singleQuery);
        } catch (error) {
          // no catch
        }
      });

      afterEach(async () => {
        await client.clearCache();
        fetchMock.restore();
      });

      it("then the method should return the requested data", () => {
        const singleQueryResult = result as ClientResult;
        expect(singleQueryResult.data).to.deep.equal(tesco.responses.singleQuery);
      });

      it("then the graphql schema should have made a fetch request", () => {
        expect(fetchMock.calls().matched).to.have.lengthOf(1);
      });

      it("then the client should have cached the response against the query", async () => {
        const responseCache = client.cache.responses;
        expect(await responseCache.size()).to.equal(2);
      });

      it("then the client should cache each data object in the response against its query path", async () => {
        const dataObjectCache = client.cache.dataObjects;
        expect(await dataObjectCache.size()).to.eql(6);
      });
    });
  });
});
