import getRequestContext from "./get-request-context";
import githubIntrospection from "./introspections/github/index.json";
import * as githubMutations from "./mutations/github";
import * as githubQueries from "./queries/github";

export {
  getRequestContext,
  githubIntrospection,
  githubMutations,
  githubQueries,
};
