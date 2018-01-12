import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as http from "http";
import { tesco } from "../../../data/graphql";
import { mockRestRequest, spyGraphqlRequest } from "../../../helpers";
import { clearDatabase } from "../../../schema/helpers";
import graphqlServer from "../../../server";
import { DefaultHandl, Handl } from "../../../../src";
import { CacheMetadata, ClientArgs, RequestResult } from "../../../../src/types";

export default function testSubscriptionOperation(args: ClientArgs): void {
  describe("the handl class in 'internal' mode", () => {
    let client: DefaultHandl;
    let server: http.Server;

    before(async () => {
      server = graphqlServer();
      client = await Handl.create(args) as DefaultHandl;
    });

    after(() => {
      server.close();
    });

    describe("the request method", () => {
      context("when a single subscription has been requested", () => {
        let result: RequestResult | undefined;

        before(async () => {
          mockRestRequest("product", "402-5806");
          spyGraphqlRequest(tesco.requests.reducedSingleMutation);

          try {
            await client.request(tesco.requests.singleSubscription, {
              awaitDataCached: true,
              subscriber: (subscription) => {
                result = subscription;
              },
            });
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(() => {
          fetchMock.restore();
        });

        context("when a mutation is requested to data that is subscribed to", () => {
          beforeEach(async () => {
            try {
              await client.request(
                tesco.requests.reducedSingleMutation,
                { awaitDataCached: true, variables: { productID: "402-5806" } },
              );
            } catch (error) {
              console.log(error); // tslint:disable-line
            }
          });

          afterEach(async () => {
            await client.clearCache();
            fetchMock.reset();
            clearDatabase();
            result = undefined;
          });

          it("then the method should return the subscribed data", () => {
            const _result = result as RequestResult;
            expect(_result.data).to.deep.equal(tesco.responses.singleSubscription);
            const cacheMetadata = _result.cacheMetadata as CacheMetadata;
            expect(cacheMetadata.size).to.equal(3);
            const queryCacheability = cacheMetadata.get("query") as Cacheability;
            expect(queryCacheability.metadata.cacheControl.maxAge).to.equal(60);
            const favouriteCacheability = cacheMetadata.get("favouriteAdded") as Cacheability;
            expect(favouriteCacheability.metadata.cacheControl.maxAge).to.equal(60);
            const productsCacheability = cacheMetadata.get("favouriteAdded.products") as Cacheability;
            expect(productsCacheability.metadata.cacheControl.maxAge).to.equal(28800);
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
