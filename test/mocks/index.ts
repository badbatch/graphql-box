import { github, tesco } from "../data/graphql";
import { mockGraphqlRequest, spyGraphqlRequest } from "../helpers";

mockGraphqlRequest(github.requests.updatedSingleQuery);
mockGraphqlRequest(github.requests.updatedSingleMutation);
spyGraphqlRequest(tesco.requests.reducedSingleMutation);
