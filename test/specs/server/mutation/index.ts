import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { tesco } from "../../../data/graphql";
import { mockRestRequest } from "../../../helpers";
import { clearDatabase } from "../../../schema/helpers";
import { DefaultHandl, Handl } from "../../../../src";
import { ClientArgs, RequestResult } from "../../../../src/types";

export default function testMutationOperation(args: ClientArgs): void {
  describe("the handl class in 'internal' mode", () => {
    let client: DefaultHandl;

    before(async () => {
      client = await Handl.create(args) as DefaultHandl;
    });

    describe("the request method", () => {
      context("when a single mutation is requested", () => {
        before(() => {
          mockRestRequest("product", "402-5806");
        });

        after(() => {
          fetchMock.restore();
        });

        context("when the mutation was successfully executed", () => {
          let result: RequestResult;

          beforeEach(async () => {
            try {
              result = await client.request(
                tesco.requests.singleMutation,
                { awaitDataCached: true, variables: { productID: "402-5806" } },
              ) as RequestResult;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            clearDatabase();
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.singleMutation);
            expect(result.cacheMetadata.size).to.equal(2);
            const queryCacheability = result.cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(60);
            const favouriteCacheability = result.cacheMetadata.get("addFavourite") as Cacheability;
            expect(favouriteCacheability.metadata.cacheControl.maxAge).to.equal(60);
          });

          it("then the graphql schema should have made fetch requests", () => {
            expect(fetchMock.calls().matched).to.have.lengthOf(1);
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
