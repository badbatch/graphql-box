import { IncrementalRequestManagerResult, RequestManagerResult, SubscriptionsManagerResult } from "@graphql-box/core";

export default (result: RequestManagerResult | IncrementalRequestManagerResult | SubscriptionsManagerResult) => {
  let resultWithoutHeaders = result;

  if ("headers" in result) {
    const { headers, ...rest } = result;
    resultWithoutHeaders = rest;
  }

  return resultWithoutHeaders;
};
