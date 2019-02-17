export { default as getRequestContext } from "./get-request-context";
export { default as getRequestData } from "./get-request-data";
import { default as githubIntrospection } from "./introspections/github/index.json";
import * as githubMutationsAndOptions from "./mutations-and-options/github";
import * as githubParsedQueries from "./parsed-queries/github";
import * as githubQueriesAndOptions from "./queries-and-options/github";
import * as githubQueryResponses from "./query-responses/github";

export {
  githubIntrospection,
  githubMutationsAndOptions,
  githubParsedQueries,
  githubQueriesAndOptions,
  githubQueryResponses,
};
