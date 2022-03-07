import map from "@cachemap/map";
import { RawResponseDataWithMaybeCacheMetadata } from "@graphql-box/core";
import { hashRequest } from "@graphql-box/helpers";
import { githubIntrospection as introspection, parsedRequests, responses } from "@graphql-box/test-utils";
import { registerWorker } from "@graphql-box/worker-client";
import fetchMock from "fetch-mock";
import sinon from "sinon";
import initClient from "../../helpers/init-client";
import { mockRequest, registerFetchMockWorker } from "../../modules/fetch-mock";

global.Date.now = sinon.stub().returns(Date.parse("June 6, 1979 GMT"));

fetchMock.config.fallbackToNetwork = true;
fetchMock.config.warnOnFallback = false;

mockRequest(fetchMock, {
  data: responses.singleTypeQuery.data,
  hash: hashRequest(parsedRequests.singleTypeQuery),
});

mockRequest(fetchMock, {
  data: responses.nestedTypeQuerySet.initial.data,
  hash: hashRequest(parsedRequests.nestedTypeQuerySet.initial),
});

mockRequest(fetchMock, {
  data: (responses.nestedTypeQuerySet.updated as RawResponseDataWithMaybeCacheMetadata).data,
  hash: hashRequest(parsedRequests.nestedTypeQuerySet.updated),
});

const typeCacheDirectives = {
  Organization: "public, max-age=1",
  Repository: "public, max-age=3",
  RepositoryConnection: "public, max-age=1",
  RepositoryOwner: "public, max-age=3",
};

(async () => {
  const client = initClient({
    cachemapStore: map(),
    debuggerName: "WORKER",
    introspection,
    typeCacheDirectives,
  });

  registerFetchMockWorker();
  registerWorker({ client });
})();
