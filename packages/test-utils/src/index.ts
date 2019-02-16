export { default as getRequestContext } from "./get-request-context";
export { default as getRequestData } from "./get-request-data";
import githubIntrospection from "./introspections/github/index.json";
import * as githubMutationsAndOptions from "./mutations-and-options/github";
import * as githubQueriesAndOptions from "./queries-and-options/github";

export {
  githubIntrospection,
  githubMutationsAndOptions,
  githubQueriesAndOptions,
};
