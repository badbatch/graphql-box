import * as fetchMock from "fetch-mock";
import { github } from "../data/graphql";
import { mockGraphqlRequest } from "../helpers";

mockGraphqlRequest(github.requests.updatedSingleQuery);
mockGraphqlRequest(github.requests.partialSingleQuery);
mockGraphqlRequest(github.requests.updatedAddMutation);
fetchMock.spy();
