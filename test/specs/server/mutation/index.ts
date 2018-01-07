import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { tesco } from "../../../data/graphql";
import { mockRestRequest } from "../../../helpers";
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
          mockRestRequest("product", "522-7645");
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
          });

          it("then the method should return the requested data", () => {
            expect(result.data).to.deep.equal(tesco.responses.singleMutation);
          });

          // TODO
        });
      });
    });
  });
}
