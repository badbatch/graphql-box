import * as defs from "../../defs";
import * as ecomRequests from "./ecom/requests";
import * as githubRequests from "./github/requests";

const githubResponses = {
  addMutation: require("./github/responses/add-mutation.json"),
  extendedSingleQuery: require("./github/responses/extended-single-query.json"),
  partialSingleQuery: require("./github/responses/partial-single-query.json"),
  reducedSingleQuery: require("./github/responses/reduced-single-query.json"),
  singleQuery: require("./github/responses/single-query.json"),
  sugaredSingleQuery: require("./github/responses/sugared-single-query.json"),
  updatedAddMutation: require("./github/responses/add-mutation.json"),
  updatedSingleQuery: require("./github/responses/single-query.json"),
  updatedSugaredSingleQuery: require("./github/responses/sugared-single-query.json"),
};

export const github: defs.RequestResponseGroup = {
  requests: githubRequests,
  responses: githubResponses,
};

const ecomResponses = {
  addMutation: require("./ecom/responses/add-mutation.json"),
  batchedQuery: require("./ecom/responses/batched-query.json"),
  extendedSingleQuery: require("./ecom/responses/extended-single-query.json"),
  reducedSingleQuery: require("./ecom/responses/reduced-single-query.json"),
  singleQuery: require("./ecom/responses/single-query.json"),
  singleSubscription: require("./ecom/responses/single-subscription.json"),
  sugaredSingleQuery: require("./ecom/responses/sugared-single-query.json"),
  updatedAddMutation: require("./ecom/responses/add-mutation.json"),
};

export const ecom: defs.RequestResponseGroup = {
  requests: ecomRequests,
  responses: ecomResponses,
};
