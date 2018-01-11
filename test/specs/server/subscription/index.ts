import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as http from "http";
import { tesco } from "../../../data/graphql";
import { mockRestRequest } from "../../../helpers";
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
      context("when a single subscription is requested", () => {
        before(() => {
          // mockRestRequest("product", "402-5806");
        });

        after(() => {
          fetchMock.restore();
        });

        context("when the subscription was successfully executed", () => {
          let result: RequestResult;

          beforeEach(async () => {
            try {
              await client.request(tesco.requests.singleSubscription, {
                subscriber: (subscription) => {
                  result = subscription;
                },
              });

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
          });
        });
      });
    });
  });
}
