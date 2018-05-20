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

export default function testTypeCacheControls(args: ClientArgs): void {
  describe("the handl client on the server", () => {
    let client: ClientHandl;
    let server: http.Server;
    let stub: sinon.SinonStub;

    before(async () => {
      mockRestRequest("product", "402-5806");
      mockRestRequest("sku", "134-5203");
      fetchMock.spy();
      stub = sinon.stub(console, "warn");
      server = await graphqlServer();
      client = await Handl.create(args) as ClientHandl;
    });

    after(() => {
      fetchMock.restore();
      stub.restore();
      server.close();
    });

    describe("Type cache controls", () => {
      context("when no type cache controls are set", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            result = await client.request(
              ecom.requests.singleQuery,
              { awaitDataCached: true, variables: { id: "402-5806" } },
            ) as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.clearCache();
          fetchMock.reset();
        });

        it("then the cache metadata should reflect what was received from the server", () => {
          const cacheMetadata = result.cacheMetadata;
          expect(cacheMetadata.size).to.equal(4);
          const operationCacheability = cacheMetadata.get("query") as Cacheability;
          expect(Number(operationCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
          const productCacheability = cacheMetadata.get("product") as Cacheability;
          expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
          const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
          expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
          const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
          expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
        });
      });

      context("when a type cache control is set on the Query type", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            await client.setTypeCacheControls({ Query: "max-age=60" });

            result = await client.request(
              ecom.requests.singleQuery,
              { awaitDataCached: true, variables: { id: "402-5806" } },
            ) as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.setTypeCacheControls({});
          await client.clearCache();
          fetchMock.reset();
        });

        it(`then the cache metadata should be made up of the Query type cache control and what was received
          from the server`, () => {
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(4);
            const operationCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(operationCacheability.metadata.cacheControl.maxAge) <= 60).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 14400).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
        });
      });

      context("when a type cache control is set on the Sku type", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            await client.setTypeCacheControls({ Sku: "max-age=120" });

            result = await client.request(
              ecom.requests.singleQuery,
              { awaitDataCached: true, variables: { id: "402-5806" } },
            ) as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.setTypeCacheControls({});
          await client.clearCache();
          fetchMock.reset();
        });

        it(`then the cache metadata should be made up of the Sku type cache control and what was received
          from the server`, () => {
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(4);
            const operationCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(operationCacheability.metadata.cacheControl.maxAge) <= 120).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 120).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 28800).to.equal(true);
        });
      });

      context("when a type cache control is set on the Product and Sku type", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            await client.setTypeCacheControls({ Product: "max-age=240", Sku: "max-age=30" });

            result = await client.request(
              ecom.requests.singleQuery,
              { awaitDataCached: true, variables: { id: "402-5806" } },
            ) as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.setTypeCacheControls({});
          await client.clearCache();
          fetchMock.reset();
        });

        it(`then the cache metadata should be made up of the Product and Sku type cache controls and what was received
          from the server`, () => {
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(4);
            const operationCacheability = cacheMetadata.get("query") as Cacheability;
            expect(Number(operationCacheability.metadata.cacheControl.maxAge) <= 30).to.equal(true);
            const productCacheability = cacheMetadata.get("product") as Cacheability;
            expect(Number(productCacheability.metadata.cacheControl.maxAge) <= 240).to.equal(true);
            const defaultSkuCacheability = cacheMetadata.get("product.defaultSku") as Cacheability;
            expect(Number(defaultSkuCacheability.metadata.cacheControl.maxAge) <= 30).to.equal(true);
            const parentCacheability = cacheMetadata.get("product.defaultSku.parentProduct") as Cacheability;
            expect(Number(parentCacheability.metadata.cacheControl.maxAge) <= 240).to.equal(true);
        });
      });
    });
  });
}
