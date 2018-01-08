import { github } from "../data/graphql";
import { mockGraphqlRequest } from "../helpers";

mockGraphqlRequest(github.requests.updatedSingleQuery);
mockGraphqlRequest(github.requests.updatedSingleMutation);
