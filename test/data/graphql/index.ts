import * as githubRequests from "./github/requests";
import * as tescoRequests from "./tesco/requests";
import { ObjectMap } from "../../../src/types";

const githubResponses = {
  aliasQuery: require("./github/responses/alias-query.json"),
  editedSingleQuery: require("./github/responses/edited-single-query.json"),
  singleMutation: require("./github/responses/single-mutation.json"),
  singleQuery: require("./github/responses/single-query.json"),
  variableMutation: require("./github/responses/single-mutation.json"),
};

export interface RequestResponseGroup {
  requests: { [key: string]: string };
  responses: { [key: string]: ObjectMap };
}

export const github: RequestResponseGroup = {
  requests: githubRequests,
  responses: githubResponses,
};

const tescoResponses = {
  editedSingleQuery: require("./tesco/responses/edited-single-query.json"),
  singleQuery: require("./tesco/responses/single-query.json"),
};

export const tesco: RequestResponseGroup = {
  requests: tescoRequests,
  responses: tescoResponses,
};
