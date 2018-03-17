import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { github } from "../../../data/graphql";
import { mockGraphqlRequest } from "../../../helpers";
import { ClientHandl, Handl, WorkerHandl } from "../../../../src";

import {
  ClientArgs,
  ExportCacheResult,
  ExportCachesResult,
  RequestResultData,
  ResponseCacheEntryResult,
} from "../../../../src/types";

export default function testImportExportMethods(args: ClientArgs, opts: { suppressWorkers?: boolean } = {}): void {
  describe(`the handl client on the browser ${!opts.suppressWorkers ? "with web workers" : ""}`, () => {
    let worker: Worker;
    let client: ClientHandl | WorkerHandl;

    before(async () => {
      if (opts.suppressWorkers) {
        mockGraphqlRequest(github.requests.updatedSingleQuery);
        worker = self.Worker;
        delete self.Worker;
      }

      client = await Handl.create(args) as ClientHandl;
    });

    after(() => {
      if (worker) self.Worker = worker;
      if (opts.suppressWorkers) fetchMock.restore();
    });

    describe("the export method", () => {
      let exportCachesResult: ExportCachesResult;
      const tag = "0c81c63a-0c44-11e8-ba89-0ed5f89f718b";

      before(async () => {
        try {
          await client.request(
            github.requests.singleQuery,
            { awaitDataCached: true, tag, variables: { login: "facebook" } },
          );
        } catch (error) {
          console.log(error); // tslint:disable-line
        }
      });

      after(async () => {
        await client.clearCache();
        if (opts.suppressWorkers) fetchMock.reset();
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
          const queryPaths = exportCachesResult.queryPaths as ExportCacheResult;
          expect(queryPaths.entries).to.be.lengthOf(14);
          expect(queryPaths.metadata).to.be.lengthOf(14);
        });

        it("then the method should return three data entity entry/metadata pair", () => {
          const dataEntities = exportCachesResult.dataEntities as ExportCacheResult;
          expect(dataEntities.entries).to.be.lengthOf(8);
          expect(dataEntities.metadata).to.be.lengthOf(8);
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
            github.requests.singleQuery,
            { awaitDataCached: true, tag, variables: { login: "facebook" } },
          ) as RequestResultData;

          exportCachesResult = await client.exportCaches(tag);
          await client.clearCache();
        } catch (error) {
          console.log(error); // tslint:disable-line
        }
      });

      after(async () => {
        await client.clearCache();
        if (opts.suppressWorkers) fetchMock.reset();
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

          expect(cacheEntry.data).to.deep.equal(github.responses.singleQuery.data);
          expect(cacheEntry.cacheMetadata.size).to.equal(1);
          const queryCacheMetadata = cacheEntry.cacheMetadata.get("query") as Cacheability;
          expect(queryCacheMetadata.metadata.cacheControl.maxAge).to.equal(300000);
        });

        it("then the client should have populated the relevant data in the data paths cache", async () => {
          const cacheSize = await client.getQueryPathCacheSize();
          expect(cacheSize).to.eql(15);
        });

        it("then the client should have populated the relevant data in the data entities cache", async () => {
          const cacheSize = await client.getDataEntityCacheSize();
          expect(cacheSize).to.eql(9);
        });
      });
    });
  });
}
