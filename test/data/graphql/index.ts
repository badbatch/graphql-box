import * as md5 from "md5";
import * as githubRequests from "./github/requests";
import * as tescoRequests from "./tesco/requests";
import { ObjectMap } from "../../../src/types";

const githubResponses = {
  aliasQuery: require("./responses/alias-query/index.json"),
  singleMutation: require("./responses/single-mutation/index.json"),
  singleQuery: require("./responses/single-query/index.json"),
  variableMutation: require("./responses/single-mutation/index.json"),
};

export const github: {
  requests: { [key: string]: string },
  responses: { [key: string]: ObjectMap },
} = {
  requests: githubRequests,
  responses: githubResponses,
};

export const tesco: {
  requests: { [key: string]: string },
} = {
  requests: tescoRequests,
};

export function getGQLResponse(hash: string): ObjectMap | undefined {
  const keys = Object.keys(github.requests);

  for (const key of keys) {
    const request = github.requests[key];
    if (!request) continue;
    const requestHash = md5(request.replace(/\s/g, ""));

    if (requestHash === hash) {
      return github.responses[key];
    }
  }

  return undefined;
}
