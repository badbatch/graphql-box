import * as githubRequests from "./github/requests";
import * as tescoRequests from "./tesco/requests";
import { ObjectMap } from "../../../src/types";

const githubResponses = {
  reducedSingleQuery: require("./github/responses/reduced-single-query.json"),
  singleMutation: require("./github/responses/single-mutation.json"),
  singleQuery: require("./github/responses/single-query.json"),
  updatedSingleMutation: require("./github/responses/single-mutation.json"),
  updatedSingleQuery: require("./github/responses/single-query.json"),
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
  reducedSingleQuery: require("./tesco/responses/reduced-single-query.json"),
  singleMutation: require("./tesco/responses/single-mutation.json"),
  singleQuery: require("./tesco/responses/single-query.json"),
};

export const tesco: RequestResponseGroup = {
  requests: tescoRequests,
  responses: tescoResponses,
};
