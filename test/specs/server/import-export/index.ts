import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as http from "http";
import * as sinon from "sinon";
import { tesco } from "../../../data/graphql";
import { mockRestRequest } from "../../../helpers";
import graphqlServer from "../../../server";
import { DefaultHandl, Handl } from "../../../../src";

import {
  ClientArgs,
  ExportCacheResult,
  ExportCachesResult,
  RequestResultData,
  ResponseCacheEntryResult,
} from "../../../../src/types";

export default function testImportExportMethods(args: ClientArgs): void {
  describe("the handl client on the server", () => {
    let client: DefaultHandl;
    let server: http.Server;
    let stub: sinon.SinonStub;

    before(async () => {
      mockRestRequest("product", "402-5806");
      mockRestRequest("sku", "134-5203");
      fetchMock.spy();
      stub = sinon.stub(console, "warn");
      server = graphqlServer();
      client = await Handl.create(args) as DefaultHandl;
    });

    after(() => {
      fetchMock.restore();
      stub.restore();
      server.close();
    });

    describe("the export method", () => {
      let exportCachesResult: ExportCachesResult;
      const tag = "0c81c63a-0c44-11e8-ba89-0ed5f89f718b";

      before(async () => {
        try {
          await client.request(
            tesco.requests.singleQuery,
            { awaitDataCached: true, tag, variables: { id: "402-5806" } },
          );
        } catch (error) {
          console.log(error); // tslint:disable-line
        }
      });

      after(async () => {
        await client.clearCache();
        fetchMock.reset();
      });

      context("when the client has data in its caches", () => {
        before(async () => {
          try {
            exportCachesResult = await client.exportCaches(tag);
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        it("then the method should return one response entry/metadata pair", () => {
          const responses = exportCachesResult.responses as ExportCacheResult;
          expect(responses.entries).to.be.lengthOf(1);
          expect(responses.metadata).to.be.lengthOf(1);
        });

        it("then the method should return five data path entry/metadata pairs", () => {
          const dataPaths = exportCachesResult.dataPaths as ExportCacheResult;
          expect(dataPaths.entries).to.be.lengthOf(5);
          expect(dataPaths.metadata).to.be.lengthOf(5);
        });

        it("then the method should return three data entity entry/metadata pair", () => {
          const dataEntities = exportCachesResult.dataEntities as ExportCacheResult;
          expect(dataEntities.entries).to.be.lengthOf(3);
          expect(dataEntities.metadata).to.be.lengthOf(3);
        });
      });
    });

    describe("the import method", () => {
      let requestResult: RequestResultData;
      let exportCachesResult: ExportCachesResult;
      const tag = "0c81c63a-0c44-11e8-ba89-0ed5f89f718b";

      before(async () => {
        try {
          requestResult = await client.request(
            tesco.requests.singleQuery,
            { awaitDataCached: true, tag, variables: { id: "402-5806" } },
          ) as RequestResultData;

          exportCachesResult = await client.exportCaches(tag);
          await client.clearCache();
        } catch (error) {
          console.log(error); // tslint:disable-line
        }
      });

      after(async () => {
        await client.clearCache();
        fetchMock.reset();
      });

      context("when exported cache results are passed in", () => {
        before(async () => {
          try {
            await client.importCaches(exportCachesResult);
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        it("then the client should have populated the relevant data in the response cache", async () => {
          const cacheSize = await client.getResponseCacheSize();
          expect(cacheSize).to.equal(2);

          const cacheEntry = await client.getResponseCacheEntry(
            requestResult.queryHash as string,
          ) as ResponseCacheEntryResult;

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

        it("then the client should have populated the relevant data in the data paths cache", async () => {
          const cacheSize = await client.getDataPathCacheSize();
          expect(cacheSize).to.eql(6);
        });

        it("then the client should have populated the relevant data in the data entities cache", async () => {
          const cacheSize = await client.getDataEntityCacheSize();
          expect(cacheSize).to.eql(4);
        });
      });
    });
  });
}
