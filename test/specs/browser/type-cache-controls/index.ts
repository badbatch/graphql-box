import { Cacheability } from "cacheability";
import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import { github } from "../../../data/graphql";
import { mockGraphqlRequest } from "../../../helpers";
import { ClientHandl, Handl, WorkerHandl } from "../../../../src";
import { ClientArgs, RequestResultData } from "../../../../src/types";

export default function testTypeCacheControls(args: ClientArgs, opts: { suppressWorkers?: boolean } = {}): void {
  describe(`the handl client on the browser ${!opts.suppressWorkers ? "with web workers" : ""}`, () => {
    let worker: Worker;
    let onMainThread: boolean;
    let client: ClientHandl | WorkerHandl;

    before(async () => {
      if (opts.suppressWorkers) {
        worker = self.Worker;
        delete self.Worker;
        onMainThread = true;
      }

      client = await Handl.create(args) as ClientHandl;
      await client.clearCache();
      onMainThread = client instanceof ClientHandl;
      if (onMainThread) mockGraphqlRequest(github.requests.updatedSingleQuery);
    });

    after(() => {
      if (worker) self.Worker = worker;
      if (onMainThread) fetchMock.restore();
    });

    describe("Type cache controls", () => {
      context("when no type cache controls are set", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            result = await client.request(
              github.requests.singleQuery,
              { awaitDataCached: true, variables: { login: "facebook" } },
            ) as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.clearCache();
          if (onMainThread) fetchMock.reset();
        });

        it("then the cache metadata should reflect what was received from the server", () => {
          const cacheMetadata = result.cacheMetadata;
          expect(cacheMetadata.size).to.equal(1);
          const operationCacheability = cacheMetadata.get("query") as Cacheability;
          expect(operationCacheability.metadata.cacheControl.maxAge).to.equal(300000);
        });
      });

      context("when a type cache control is set on the Query type", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            await client.setTypeCacheControls({ Query: "max-age=60" });

            result = await client.request(
              github.requests.singleQuery,
              { awaitDataCached: true, variables: { login: "facebook" } },
            ) as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.setTypeCacheControls({});
          await client.clearCache();
          if (onMainThread) fetchMock.reset();
        });

        it(`then the cache metadata should be made up of the Query type cache control and what was received
          from the server`, () => {
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(1);
            const operationCacheability = cacheMetadata.get("query") as Cacheability;
            expect(operationCacheability.metadata.cacheControl.maxAge).to.equal(60);
        });
      });

      context("when a type cache control is set on the Organization type", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            await client.setTypeCacheControls({ Organization: "max-age=120" });

            result = await client.request(
              github.requests.singleQuery,
              { awaitDataCached: true, variables: { login: "facebook" } },
            ) as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.setTypeCacheControls({});
          await client.clearCache();
          if (onMainThread) fetchMock.reset();
        });

        it(`then the cache metadata should be made up of the Query type cache control and what was received
          from the server`, () => {
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(2);
            const operationCacheability = cacheMetadata.get("query") as Cacheability;
            expect(operationCacheability.metadata.cacheControl.maxAge).to.equal(120);
            const organizationCacheability = cacheMetadata.get("organization") as Cacheability;
            expect(organizationCacheability.metadata.cacheControl.maxAge).to.equal(120);
        });
      });

      context("when a type cache control is set on the Organization and Repository types", () => {
        let result: RequestResultData;

        before(async () => {
          try {
            await client.setTypeCacheControls({ Organization: "max-age=240", Repository: "max-age=30" });

            result = await client.request(
              github.requests.singleQuery,
              { awaitDataCached: true, variables: { login: "facebook" } },
            ) as RequestResultData;
          } catch (error) {
            console.log(error); // tslint:disable-line
          }
        });

        after(async () => {
          await client.setTypeCacheControls({});
          await client.clearCache();
          if (onMainThread) fetchMock.reset();
        });

        it(`then the cache metadata should be made up of the Organization and Repository type cache controls and what
          was received from the server`, () => {
            const cacheMetadata = result.cacheMetadata;
            expect(cacheMetadata.size).to.equal(3);
            const operationCacheability = cacheMetadata.get("query") as Cacheability;
            expect(operationCacheability.metadata.cacheControl.maxAge).to.equal(30);
            const organizationCacheability = cacheMetadata.get("organization") as Cacheability;
            expect(organizationCacheability.metadata.cacheControl.maxAge).to.equal(240);
            const repositoryCacheability = cacheMetadata.get("organization.repositories.edges.node") as Cacheability;
            expect(repositoryCacheability.metadata.cacheControl.maxAge).to.equal(30);
        });
      });
    });
  });
}
