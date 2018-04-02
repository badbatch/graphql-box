import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as http from "http";
import * as sinon from "sinon";
import { ecom } from "../../../data/graphql";
import { mockRestRequest } from "../../../helpers";
import graphqlServer from "../../../server";
import { ClientHandl, Handl } from "../../../../src";
import { ClientArgs, RequestResultData } from "../../../../src/types";

export default function testMutationOperation(args: ClientArgs): void {
  describe("the handl client on the server", () => {
    let client: ClientHandl;
    let server: http.Server;
    let stub: sinon.SinonStub;

    before(async () => {
      stub = sinon.stub(console, "warn");
      server = await graphqlServer();
      client = await Handl.create(args) as ClientHandl;
    });

    after(() => {
      stub.restore();
      server.close();
    });

    describe("the request method", () => {
      context("when a single mutation is requested", () => {
        before(() => {
          mockRestRequest("product", "402-5806");
          fetchMock.spy();
        });

        after(() => {
          fetchMock.restore();
        });

        context("when the mutation was successfully executed", () => {
          let result: RequestResultData;

          beforeEach(async () => {
            try {
              result = await client.request(
                ecom.requests.addMutation,
                { awaitDataCached: true, variables: { productID: "402-5806" } },
              ) as RequestResultData;
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();

            await client.request(
              ecom.requests.removeMutation,
              { awaitDataCached: true, variables: { productID: "402-5806" } },
            );
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(ecom.responses.addMutation);
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(3);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(60);
            const favouriteCacheability = cacheMetadata.get("addFavourite") as Cacheability;
            expect(favouriteCacheability.metadata.cacheControl.maxAge).to.equal(60);
            const productsCacheability = cacheMetadata.get("addFavourite.products") as Cacheability;
            expect(productsCacheability.metadata.cacheControl.maxAge).to.equal(28800);
          });

          it("then the client should not have cached the response against the query", async () => {
            const cacheSize = await client.getResponseCacheSize();
            expect(cacheSize).to.equal(1);
          });

          it("then the client should not have stored any data in the in the data path cache", async () => {
            const cacheSize = await client.getQueryPathCacheSize();
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
