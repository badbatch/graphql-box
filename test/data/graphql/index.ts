import * as githubRequests from "./github/requests";
import * as tescoRequests from "./tesco/requests";
import { ObjectMap } from "../../../src/types";

const githubResponses = {
  addMutation: require("./github/responses/add-mutation.json"),
  reducedSingleQuery: require("./github/responses/reduced-single-query.json"),
  singleQuery: require("./github/responses/single-query.json"),
  updatedAddMutation: require("./github/responses/add-mutation.json"),
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
  addMutation: require("./tesco/responses/add-mutation.json"),
  reducedSingleQuery: require("./tesco/responses/reduced-single-query.json"),
  singleQuery: require("./tesco/responses/single-query.json"),
  singleSubscription: require("./tesco/responses/single-subscription.json"),
  updatedAddMutation: require("./tesco/responses/add-mutation.json"),
};

export const tesco: RequestResponseGroup = {
  requests: tescoRequests,
  responses: tescoResponses,
};
