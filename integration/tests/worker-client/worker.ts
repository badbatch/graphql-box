import map from "@cachemap/map";
import { responses } from "@handl/test-utils";
import { registerWorker } from "@handl/worker-client";
import sinon from "sinon";
import { initClient, mockRequest } from "../../helpers";

global.Date.now = sinon.stub().returns(Date.parse("June 6, 1979"));

mockRequest({ data: responses.singleTypeQuery.data });

const typeCacheDirectives = {
  Organization: "public, max-age=1",
  Repository: "public, max-age=3",
  RepositoryConnection: "public, max-age=1",
  RepositoryOwner: "public, max-age=3",
};

(async () => {
  const client = await initClient({
    cachemapStore: map(),
    debuggerName: "WORKER",
    typeCacheDirectives,
  });

  registerWorker({ client });
})();
